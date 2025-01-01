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
          "circle-color": "#622b4b",
          "circle-opacity": 0.75,
          "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 20, 40],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "locations",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
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
          "circle-color": "#622b4b",
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            12, // hover size
            8, // default size
          ],
          "circle-stroke-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            3, // hover stroke
            2, // default stroke
          ],
          "circle-stroke-color": "#fff",
          "circle-opacity": 1,
          "circle-stroke-opacity": 1,
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
        const properties = e.features?.[0].properties;

        if (!properties) return;

        new mapboxgl.Popup({
          offset: [0, -15],
          className: "modern-popup",
          maxWidth: "280px",
          closeButton: false,
          closeOnClick: true,
          focusAfterOpen: false,
          anchor: "bottom",
        })
          .setLngLat(coordinates)
          .setHTML(
            `
          <div class="p-4">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-[#622b4b]"></div>
                <h3 class="font-medium tracking-tight text-zinc-900">
                  ${properties.serviceCenter}
                </h3>
              </div>
              <p class="text-sm text-zinc-600 pl-4">
                ${properties.streetName}
              </p>
            </div>
          </div>
        `
          )
          .addTo(map);
      });

      // Add hover effect for unclustered points
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
