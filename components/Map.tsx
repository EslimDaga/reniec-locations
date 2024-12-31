"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { useCallback, useEffect, useRef } from "react";

import mapboxgl from "mapbox-gl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

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

  const createCustomMarker = (coordinates: [number, number]) => {
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
  };

  const handleLocationFound = useCallback((position: GeolocationPosition) => {
    const coordinates: [number, number] = [
      position.coords.longitude,
      position.coords.latitude,
    ];
    createCustomMarker(coordinates);
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: initialCoordinates,
      zoom: zoom,
      attributionControl: false,
    });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(handleLocationFound);
    }

    return () => {
      userLocationMarker.current?.remove();
      map.current?.remove();
    };
  }, [initialCoordinates, zoom, handleLocationFound]);

  return <div ref={mapContainer} className={`h-screen w-full ${className}`} />;
}
