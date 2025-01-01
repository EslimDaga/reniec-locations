"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { useCallback, useEffect, useRef, useState } from "react";

import mapboxgl from "mapbox-gl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  serviceCenter: string;
  streetName: string;
}

interface MapProps {
  className?: string;
  initialCoordinates?: [number, number];
  zoom?: number;
}

export default function Map({
  className = "",
  initialCoordinates = [-74.006, 40.7128],
  zoom = 12,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userLocationMarker = useRef<mapboxgl.Marker | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/data/locations.json");
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error loading locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const initializeClusters = useCallback(
    (map: mapboxgl.Map, locations: Location[]) => {
      map.addSource("locations", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: locations.map((location) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [location.longitude, location.latitude],
            },
            properties: {
              id: location.id,
              serviceCenter: location.serviceCenter,
              streetName: location.streetName,
            },
          })),
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "locations",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#000000",
          "circle-opacity": 0.8,
          "circle-radius": ["step", ["get", "point_count"], 16, 10, 24, 20, 32],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "locations",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 11,
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "locations",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#000000",
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            8,
            4,
          ],
          "circle-stroke-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            2,
            0,
          ],
          "circle-stroke-color": "#ffffff",
          "circle-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.75,
          ],
        },
      });

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties?.cluster_id;
        const source = map.getSource("locations") as mapboxgl.GeoJSONSource;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (
            err ||
            !features[0].geometry.type.includes("Point") ||
            zoom === null
          )
            return;

          const coordinates = (features[0].geometry as GeoJSON.Point)
            .coordinates as [number, number];

          map.easeTo({
            center: coordinates,
            zoom: zoom,
          });
        });
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("click", "unclustered-point", (e) => {
        const coordinates = (
          e.features?.[0].geometry as GeoJSON.Point
        ).coordinates.slice() as [number, number];

        if (!coordinates) return;

        map.flyTo({
          center: coordinates,
          zoom: 15,
          duration: 1500,
          essential: true,
        });
      });

      let hoveredStateId: string | null = null;

      map.on("mouseenter", "unclustered-point", (e) => {
        map.getCanvas().style.cursor = "pointer";

        if (e.features && e.features[0].id) {
          if (hoveredStateId) {
            map.setFeatureState(
              { source: "locations", id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id as string;
          map.setFeatureState(
            { source: "locations", id: hoveredStateId },
            { hover: true }
          );
        }
      });

      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
        if (hoveredStateId) {
          map.setFeatureState(
            { source: "locations", id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
      });
    },
    []
  );

  const createCustomMarker = useCallback((coordinates: [number, number]) => {
    const markerElement = document.createElement("div");
    markerElement.className = "relative flex items-center justify-center";

    const ring = document.createElement("div");
    ring.className =
      "absolute -inset-4 rounded-full bg-emerald-500/30 animate-[ping_3s_ease-in-out_infinite]";
    markerElement.appendChild(ring);

    const dot = document.createElement("div");
    dot.className =
      "absolute w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50";
    markerElement.appendChild(dot);

    if (userLocationMarker.current) {
      userLocationMarker.current.remove();
    }

    userLocationMarker.current = new mapboxgl.Marker({
      element: markerElement,
      anchor: "center",
    })
      .setLngLat(coordinates)
      .addTo(map.current!);

    map.current?.flyTo({
      center: coordinates,
      zoom: 15,
      duration: 2000,
      essential: true,
    });
  }, []);

  const handleLocationFound = useCallback(
    (position: GeolocationPosition) => {
      const coordinates: [number, number] = [
        position.coords.longitude,
        position.coords.latitude,
      ];
      createCustomMarker(coordinates);
    },
    [createCustomMarker]
  );

  useEffect(() => {
    if (!mapContainer.current || !locations.length) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: initialCoordinates,
      zoom: zoom,
      attributionControl: false,
    });

    const mapInstance = map.current;

    mapInstance.on("load", () => {
      initializeClusters(mapInstance, locations);
    });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(handleLocationFound);
    }

    return () => {
      mapInstance?.remove();
    };
  }, [
    initialCoordinates,
    zoom,
    handleLocationFound,
    locations,
    initializeClusters,
  ]);

  return <div ref={mapContainer} className={`h-screen w-full ${className}`} />;
}
