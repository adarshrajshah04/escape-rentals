
"use client";

import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

const createPropertyIcon = () => {
  return L.divIcon({
    className: "property-location-marker",
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: var(--escaperentals-primary);
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });
};

const PropertyLocationMap = ({
  location,
  propertyName,
  latitude,
  longitude,
}) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const findLocation = async () => {
      try {
        setLoading(true);
        setError("");

        // First check API coordinates
        const lat = Number(latitude);
        const lng = Number(longitude);

        if (
          latitude !== null &&
          latitude !== undefined &&
          latitude !== "" &&
          longitude !== null &&
          longitude !== undefined &&
          longitude !== "" &&
          Number.isFinite(lat) &&
          Number.isFinite(lng)
        ) {
          if (!cancelled) {
            setPosition([lat, lng]);
          }

          return;
        }

        // Fallback: Use location name
        if (!location) {
          throw new Error("Property location is unavailable.");
        }

        const cacheKey = `property-location-${location.toLowerCase()}`;

        let coordinates = null;

        try {
          const cached = localStorage.getItem(cacheKey);

          if (cached) {
            coordinates = JSON.parse(cached);
          }
        } catch {
          coordinates = null;
        }

        if (!coordinates) {
          const url = new URL(
            "https://nominatim.openstreetmap.org/search"
          );

          url.searchParams.set("q", `${location}, India`);
          url.searchParams.set("format", "jsonv2");
          url.searchParams.set("limit", "1");
          url.searchParams.set("countrycodes", "in");

          const response = await fetch(url.toString());

          if (!response.ok) {
            throw new Error("Unable to find this property location.");
          }

          const data = await response.json();

          if (!data.length) {
            throw new Error("Location could not be found on the map.");
          }

          coordinates = {
            latitude: Number(data[0].lat),
            longitude: Number(data[0].lon),
          };

          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify(coordinates)
            );
          } catch {
            // Map can work without browser cache.
          }
        }

        if (!cancelled) {
          setPosition([
            coordinates.latitude,
            coordinates.longitude,
          ]);
        }

      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load map.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    findLocation();

    return () => {
      cancelled = true;
    };
  }, [location, latitude, longitude]);

  if (loading) {
    return (
      <div className="flex h-[350px] items-center justify-center rounded-2xl bg-background">
        <p className="text-text-secondary">Finding property location...</p>
      </div>
    );
  }

  if (error || !position) {
    return (
      <div className="flex h-[250px] items-center justify-center rounded-2xl bg-background p-5">
        <p className="text-center text-sm text-text-secondary">
          {error || "Map location unavailable."}
        </p>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full overflow-hidden rounded-2xl border border-border/60">

      <MapContainer
        key={`${position[0]}-${position[1]}`}
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        style={{
          height: "100%",
          width: "100%",
        }}
      >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={position}
          icon={createPropertyIcon()}
        >
          <Popup>
            <div>
              <h3 className="font-semibold text-text-primary">
                {propertyName}
              </h3>

              <p className="mt-1 text-sm text-text-secondary">
                {location}
              </p>
            </div>
          </Popup>
        </Marker>

      </MapContainer>

    </div>
  );
};

export default PropertyLocationMap;
