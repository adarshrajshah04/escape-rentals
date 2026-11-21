"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowRight } from "react-icons/fa6";

import { fetchProperties } from "@/redux/action/properties.action";
import { BASE_URL } from "@/utils/axiosNew";

const FeaturedPropertyHero = () => {
  const dispatch = useDispatch();

  const { properties = [], isLoading } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  // Select first active property
  const featuredProperty = properties.find(
    (property) => property.is_active
  );

  if (isLoading || !featuredProperty) {
    return null;
  }

  const imageUrl = featuredProperty.cover_image
    ? new URL(
        featuredProperty.cover_image.replace(/^\/+/, ""),
        BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`
      ).href
    : null;

  return (
    <section className="px-4 md:px-6 py-5">

      <div className="relative min-h-[480px] md:min-h-[540px] rounded-2xl overflow-hidden flex items-center">

        {/* Background Image */}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={featuredProperty.name}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        )}

        {!imageUrl && (
          <div className="absolute inset-0 bg-primary" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative z-10 w-full px-5 md:px-12 py-12">

          <div className="max-w-xl bg-white/85 backdrop-blur-md rounded-xl p-7 md:p-10 shadow-xl">

            {/* Label */}
            <span className="inline-block text-primary text-xs font-bold uppercase tracking-widest mb-4">
              Discover Your Next Stay
            </span>

            {/* Property Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              {featuredProperty.name}
            </h1>

            {/* Price */}
            <div className="mt-4">
              <span className="text-2xl font-bold text-primary">
                ₹{Number(
                  featuredProperty.price_per_night || 0
                ).toLocaleString("en-IN")}
              </span>

              <span className="text-text-secondary">
                {" "}/ night
              </span>
            </div>

            {/* Description */}
            <p className="text-text-secondary mt-5 leading-relaxed line-clamp-3">
              {featuredProperty.description ||
                "Experience comfort, luxury and unforgettable moments at this beautiful property."}
            </p>

            {/* Location */}
            <p className="text-sm text-text-secondary mt-4">
              {featuredProperty.location}
            </p>

            {/* Button */}
            <Link
              href={`/properties/${featuredProperty.id}`}
              className="inline-flex items-center gap-3 mt-7 bg-primary text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 group"
            >
              Book Now

              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertyHero;

