
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { FiMapPin, FiUsers } from "react-icons/fi";

import { fetchProperties } from "@/redux/action/properties.action";
import { BASE_URL } from "@/utils/axiosNew";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
  <button onClick={onClick} className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-white p-3 text-primary shadow-md transition-colors hover:bg-primary hover:text-white">
    <FaArrowRight />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button onClick={onClick} className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-white p-3 text-primary shadow-md transition-colors hover:bg-primary hover:text-white">
    <FaArrowLeft />
  </button>
);

const FeaturedHomes = () => {
  const dispatch = useDispatch();

  const { properties = [], isLoading, errorMsg } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const settings = {
    dots: 3,
    infinite: properties.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, arrows: false },
      },
    ],
  };

  return (
    <section className="bg-background pt-16 pb-6 md:pt-20 md:pb-4">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
              Explore Our Collection
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              Featured Homes
            </h2>

            <p className="text-text-secondary mt-3 max-w-xl">
              Discover beautiful stays selected for your next unforgettable escape.
            </p>
          </div>

          
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-80 rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && errorMsg && (
          <p className="text-center text-danger py-10">{errorMsg}</p>
        )}

        {/* Empty */}
        {!isLoading && !errorMsg && properties.length === 0 && (
          <p className="text-center text-text-secondary py-10">
            No properties available right now.
          </p>
        )}

        {/* Properties */}
        {!isLoading && !errorMsg && properties.length > 0 && (
          <div className="relative overflow-x-clip px-2">
            <Slider {...settings}>
              {properties.slice(0,5).map((property) => {
                const imageUrl = property.cover_image
                  ? new URL(
                      property.cover_image.replace(/^\/+/, ""),
                      BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`
                    ).href
                  : null;

                return (
                  <div key={property.id} className="px-3 pb-8">
                    <div className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">

                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={property.name || "Property"}
                            fill
                            unoptimized
                            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                        ) : (
                          <div className="w-full h-full bg-surface flex items-center justify-center text-text-secondary">
                            No Image Available
                          </div>
                        )
                        }

                       
                          <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-primary">
                            Featured 
                          </span>
                        
                      </div>

                      {/* Details */}
                      <div className="p-5">
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="text-lg font-bold text-text-primary line-clamp-1">
                            {property.name}
                          </h3>

                          {property.rating && (
                            <span className="flex items-center gap-1 text-sm font-semibold shrink-0">
                              <FaStar className="text-warning" />
                              {property.rating}
                            </span>
                          )}
                        </div>

                        <p className="flex items-center gap-2 mt-2 text-sm text-text-secondary">
                          <FiMapPin className="shrink-0" />
                          <span className="line-clamp-1">
                            {property.location || "Location unavailable"}
                          </span>
                        </p>

                        <div className="flex items-center gap-2 mt-3 text-sm text-text-secondary">
                          <FiUsers />
                          {property.guest_capacity || "N/A"} Guests
                        </div>

                        <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-primary">
                              ₹{Number(property.price_per_night || 0).toLocaleString("en-IN")}
                            </span>
                            <span className="text-sm text-text-secondary">
                              / night
                            </span>
                          </div>

                          <Link
                            href={`properties/${property.id}`}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-secondary transition"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedHomes;
