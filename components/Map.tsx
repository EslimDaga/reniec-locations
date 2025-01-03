"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { useCallback, useEffect, useRef, useState } from "react";

import LocationCard from "./LocationCard";
import mapboxgl from "mapbox-gl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface Location {
  id: string;
  regionalOffices: string;
  department: string;
  province: string;
  district: string;
  serviceCenter: string;
  sioCode: string;
  localTypeAbbreviation: string;
  status: string;
  publicServiceHours: string;
  takesPhoto: string;
  deliversElectronicDNI: string;
  dniMajorProcedure: string;
  dniDeliveries: string;
  civilRecordsRegistration: string;
  civilRecordsCertification: string;
  ruipnCertification: string;
  erep: string;
  streetName: string;
  latitude: number;
  longitude: number;
  geocoded_at: string;
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
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

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
            id: location.id,
            geometry: {
              type: "Point",
              coordinates: [location.longitude, location.latitude],
            },
            properties: { ...location },
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
        id: "unclustered-point-base",
        type: "circle",
        source: "locations",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#10b981",
            "#000000",
          ],
          "circle-radius": 3.5,
          "circle-opacity": [
            "case",
            [
              "any",
              ["boolean", ["feature-state", "hover"], false],
              ["boolean", ["feature-state", "selected"], false],
            ],
            1,
            0.75,
          ],
        },
      });

      map.addLayer(
        {
          id: "unclustered-point-radius",
          type: "circle",
          source: "locations",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-radius": 20,
            "circle-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              "#10b981",
              "#000000",
            ],
            "circle-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.15,
              ["boolean", ["feature-state", "selected"], false],
              0.1,
              0,
            ],
            "circle-stroke-width": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              ["boolean", ["feature-state", "selected"], false],
              1,
              0,
            ],
            "circle-stroke-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              "#059669",
              "#9ca3af",
            ],
            "circle-stroke-opacity": 0.5,
          },
        },
        "unclustered-point-base"
      );

      let hoveredStateId: string | null = null;
      let selectedStateId: string | null = null;

      map.on("mousemove", "unclustered-point-base", (e) => {
        if (e.features?.length && e.features[0].id) {
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
          map.getCanvas().style.cursor = "pointer";
        }
      });

      map.on("mouseleave", "unclustered-point-base", () => {
        if (hoveredStateId) {
          map.setFeatureState(
            { source: "locations", id: hoveredStateId },
            { hover: false }
          );
          hoveredStateId = null;
          map.getCanvas().style.cursor = "";
        }
      });

      map.on("click", "unclustered-point-base", (e) => {
        if (e.features?.length) {
          const location = e.features[0].properties as Location;
          const clickedId = e.features[0].id as string;

          if (selectedStateId) {
            map.setFeatureState(
              { source: "locations", id: selectedStateId },
              { selected: false }
            );
          }

          selectedStateId = clickedId;
          map.setFeatureState(
            { source: "locations", id: selectedStateId },
            { selected: true }
          );

          setSelectedLocation(location);
          map.flyTo({
            center: [location.longitude, location.latitude],
            zoom: 15,
            duration: 1500,
          });
        }
      });

      return () => {
        if (selectedStateId) {
          map.setFeatureState(
            { source: "locations", id: selectedStateId },
            { selected: false }
          );
        }
      };
    },
    [setSelectedLocation]
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

  return (
    <div className="relative h-screen w-full">
      <div ref={mapContainer} className={`h-full w-full ${className}`} />
      <LocationCard location={selectedLocation} />
    </div>
  );
}
