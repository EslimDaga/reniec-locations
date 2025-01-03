"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { useCallback, useEffect, useRef, useState } from "react";

import { Location } from "@/types/location";
import LocationCard from "./LocationCard";
import mapboxgl from "mapbox-gl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
const PERU_CENTER: [number, number] = [-74.0465, -9.19];
const INITIAL_ZOOM = 2.4;

interface MapProps {
  className?: string;
  initialCoordinates?: [number, number];
  zoom?: number;
}

export default function Map({
  className = "",
  initialCoordinates = PERU_CENTER,
  zoom = INITIAL_ZOOM,
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

  const initializeMarkers = useCallback(
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
      });

      map.addLayer({
        id: "location-points-base",
        type: "circle",
        source: "locations",
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

      map.addLayer({
        id: "location-points-radius",
        type: "circle",
        source: "locations",
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
      });

      let hoveredStateId: string | null = null;
      let selectedStateId: string | null = null;

      map.on("mousemove", "location-points-base", (e) => {
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

      map.on("mouseleave", "location-points-base", () => {
        if (hoveredStateId) {
          map.setFeatureState(
            { source: "locations", id: hoveredStateId },
            { hover: false }
          );
          hoveredStateId = null;
          map.getCanvas().style.cursor = "";
        }
      });

      map.on("click", "location-points-base", (e) => {
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
            zoom: 13,
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
      center: PERU_CENTER,
      zoom: INITIAL_ZOOM,
      attributionControl: false,
      maxBounds: [
        [-180, -85],
        [180, 85],
      ],
      minZoom: 2,
      maxZoom: 18,
      projection: "globe",
    });

    const mapInstance = map.current;

    mapInstance.on("load", () => {
      mapInstance.setFog({
        color: "rgb(255, 255, 255)",
        "high-color": "rgb(220, 235, 255)",
        "horizon-blend": 0.055,
        "space-color": "rgb(0, 0, 0)",
        "star-intensity": 0.85,
      });

      initializeMarkers(mapInstance, locations);
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
    initializeMarkers,
  ]);

  return (
    <div className="relative h-screen w-full">
      <div ref={mapContainer} className={`h-full w-full ${className}`} />
      <LocationCard location={selectedLocation} />
    </div>
  );
}
