
"use client";

import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

// Custom Price Marker
const createPriceIcon = (price) => {
  return L.divIcon({
    className: "custom-price-marker",
    html: `
      <div style="
        background: var(--escaperentals-primary);
        color: white;
        padding: 7px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      ">
        ₹${Number(price).toLocaleString("en-IN")}
      </div>
    `,
    iconSize: [90, 35],
    iconAnchor: [45, 35],
  });
};

const PropertyMap = ({ properties = [] }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const getCoordinates = async () => {
      setLoading(true);
      setMapError("");

      const results = [];
      const uniqueLocations = [
        ...new Set(
          properties
            .map((property) => property.location?.trim())
            .filter(Boolean)
        ),
      ];

      try {
        for (let i = 0; i < uniqueLocations.length; i++) {
          if (cancelled) return;

          const location = uniqueLocations[i];
          const cacheKey = `property-map-${location.toLowerCase()}`;

          let coordinates = null;

          // Check cached coordinates
          try {
            const cached = localStorage.getItem(cacheKey);

            if (cached) {
              coordinates = JSON.parse(cached);
            }
          } catch {
            coordinates = null;
          }

          // Get coordinates from OpenStreetMap Nominatim
          if (!coordinates) {
            // Respect public service request limit
            if (i > 0) {
              await new Promise((resolve) =>
                setTimeout(resolve, 1100)
              );
            }

            if (cancelled) return;

            const url = new URL(
              "https://nominatim.openstreetmap.org/search"
            );

            url.searchParams.set("q", `${location}, India`);
            url.searchParams.set("format", "jsonv2");
            url.searchParams.set("limit", "1");
            url.searchParams.set("countrycodes", "in");

            const response = await fetch(url.toString());

            if (!response.ok) {
              throw new Error("Unable to fetch location coordinates.");
            }

            const data = await response.json();

            if (data.length > 0) {
              coordinates = {
                latitude: Number(data[0].lat),
                longitude: Number(data[0].lon),
              };

              // Cache coordinates in browser
              try {
                localStorage.setItem(
                  cacheKey,
                  JSON.stringify(coordinates)
                );
              } catch {
                // Continue even if browser storage is unavailable
              }
            }
          }

          if (coordinates) {
            properties
              .filter(
                (property) =>
                  property.location?.trim() === location
              )
              .forEach((property) => {
                results.push({
                  ...property,
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                });
              });
          }
        }

        if (!cancelled) {
          setLocations(results);
        }
      } catch (error) {
        if (!cancelled) {
          setMapError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getCoordinates();

    return () => {
      cancelled = true;
    };
  }, [properties]);

  if (loading) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-2xl bg-background">
        <p className="text-text-secondary">Finding property locations...</p>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-2xl bg-background p-5">
        <p className="text-center text-danger">{mapError}</p>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-2xl bg-background">
        <p className="px-4 text-center text-text-secondary">
          No matching property locations found.
        </p>
      </div>
    );
  }

  const firstProperty = locations[0];

  return (
    <div className="h-[450px] w-full overflow-hidden rounded-2xl border border-border/60">

      <MapContainer
        key={locations.map((p) => p.id).join("-")}
        center={[
          firstProperty.latitude,
          firstProperty.longitude,
        ]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((property) => (
          <Marker
            key={property.id}
            position={[
              property.latitude,
              property.longitude,
            ]}
            icon={createPriceIcon(property.price_per_night)}
          >
            <Popup>
              <div className="min-w-[160px]">
                <h3 className="font-semibold text-text-primary">
                  {property.name}
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                  {property.location}
                </p>

                <p className="mt-2 font-bold text-primary">
                  ₹{Number(property.price_per_night).toLocaleString("en-IN")}
                  <span className="text-xs font-normal text-text-secondary">
                    {" "}/ night
                  </span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

    </div>
  );
};

export default PropertyMap;
