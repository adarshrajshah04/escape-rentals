
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowRight } from "react-icons/fa6";

import { fetchCategory } from "@/redux/action/category.action";
import { BASE_URL } from "@/utils/axiosNew";

const AllCategories = () => {
  const dispatch = useDispatch();

  const {
    categories = [],
    isLoading,
    errorMsg,
  } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  const getImageUrl = (image) => {
    if (!image) return null;

    return new URL(
      image.replace(/^\/+/, ""),
      BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`
    ).href;
  };

  return (
    <section className="bg-background min-h-screen py-16 md:py-20">

      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="mb-12 text-center">

          

          <h1 className="text-3xl md:text-5xl font-bold text-text-primary">
            Find a Place That Fits Your Comfort
          </h1>

          <p className="text-text-secondary mt-4 max-w-xl mx-auto">
            Discover different types of stays and find the perfect
            accommodation for your next getaway.
          </p>

        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="h-72 bg-surface rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && errorMsg && (
          <p className="text-center text-danger py-10">
            {errorMsg}
          </p>
        )}

        {/* Empty */}
        {!isLoading && !errorMsg && categories.length === 0 && (
          <p className="text-center text-text-secondary py-16">
            No categories available right now.
          </p>
        )}

        {/* All Categories */}
        {!isLoading && !errorMsg && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {categories.map((category) => {
              const imageUrl = getImageUrl(category.image);

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="group relative h-72 rounded-2xl overflow-hidden"
                >

                  {/* Image */}
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={category.name || "Category"}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <span className="font-semibold text-text-primary">
                        {category.name}
                      </span>
                    </div>
                  )}

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 inset-x-0 p-6 flex items-center justify-between">

                    <h2 className="text-white text-xl font-bold capitalize">
                      {category.name}
                    </h2>

                    <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition">
                      <FaArrowRight />
                    </span>

                  </div>

                </Link>
              );
            })}

          </div>
        )}

        {/* Back Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="text-primary font-semibold hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </section>
  );
};

export default AllCategories;
