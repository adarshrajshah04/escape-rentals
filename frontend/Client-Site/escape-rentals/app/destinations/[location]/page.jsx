
"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { FiMapPin, FiUsers } from "react-icons/fi";

import { fetchProperties } from "@/redux/action/properties.action";
import { BASE_URL } from "@/utils/axiosNew";

const DestinationPage = () => {
  const { location } = useParams();
  const dispatch = useDispatch();
  
  

  const { properties = [], isLoading, errorMsg } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  // Filter properties according to location
  const filteredProperties = properties.filter((property) =>
    property.location
      ?.toLowerCase()
      .includes(location.toLowerCase())
  );

  return (
    <section className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-primary uppercase tracking-widest text-sm font-semibold">
            Explore Destination
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-3 capitalize">
            Properties in {location}
          </h1>

          <p className="text-text-secondary mt-3">
            Discover the best places to stay in {location}.
          </p>

          {!isLoading && (
            <p className="mt-4 text-sm text-text-secondary">
              {filteredProperties.length} Properties Found
            </p>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-20">
            Loading properties...
          </div>
        )}

        {/* Error */}
        {!isLoading && errorMsg && (
          <p className="text-center text-danger py-10">
            {errorMsg}
          </p>
        )}

        {/* Empty */}
        {!isLoading && !errorMsg && filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-text-primary">
              No Properties Found
            </h2>

            <p className="text-text-secondary mt-3">
              Currently no properties available in {location}.
            </p>

            <Link
              href="/"
              className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg"
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && !errorMsg && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

            {filteredProperties.map((property) => {

              const imageUrl = property.cover_image
                ? new URL(
                    property.cover_image.replace(/^\/+/, ""),
                    BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`
                  ).href
                : null;

              return (
                <div
                  key={property.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl transition"
                >

                  {/* Image */}
                  <div className="relative h-60 overflow-hidden">

                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={property.name || "Property"}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface">
                        No Image Available
                      </div>
                    )}

                    {property.category?.name && (
                      <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-primary">
                        {property.category.name}
                      </span>
                    )}

                  </div>

                  {/* Details */}
                  <div className="p-5">

                    <div className="flex justify-between gap-3">
                      <h3 className="text-lg font-bold text-text-primary">
                        {property.name}
                      </h3>

                      {property.rating && (
                        <span className="flex items-center gap-1 text-sm">
                          <FaStar className="text-warning" />
                          {property.rating}
                        </span>
                      )}
                    </div>

                    <p className="flex items-center gap-2 mt-3 text-sm text-text-secondary">
                      <FiMapPin />
                      {property.location}
                    </p>

                    <p className="flex items-center gap-2 mt-3 text-sm text-text-secondary">
                      <FiUsers />
                      {property.guest_capacity || "N/A"} Guests
                    </p>

                    <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">

                      <div>
                        <span className="text-xl font-bold text-primary">
                          ₹{Number(property.price_per_night || 0).toLocaleString("en-IN")}
                        </span>

                        <span className="text-sm text-text-secondary">
                          / night
                        </span>
                      </div>

                      <Link
                        href={`/properties/${property.id}`}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
                      >
                        View Details
                      </Link>

                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </section>
  );
};

export default DestinationPage;
