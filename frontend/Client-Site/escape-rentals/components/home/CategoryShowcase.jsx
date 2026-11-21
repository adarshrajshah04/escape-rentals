
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowRight } from "react-icons/fa6";

import { fetchCategory } from "@/redux/action/category.action";
import { BASE_URL } from "@/utils/axiosNew";

const CategoryShowcase = () => {
  const dispatch = useDispatch();

  // Get categories from Redux category slice
  const { categories = [], isLoading, errorMsg } = useSelector(
    (state) => state.categories
  );

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  // Image URL
  const getImageUrl = (image) => {
    if (!image) return null;

    return new URL(
      image.replace(/^\/+/, ""),
      BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`
    ).href;
  };

  // Different grid sizes
  const gridClasses = [
    "md:col-span-2",
    "md:col-span-1",
    "md:col-span-1",
    "md:col-span-1",
    "md:col-span-1",
    "md:col-span-2",
  ];

  return (
    <section className="bg-background py-16 md:py-20">

      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Heading */}
        <div className="text-center mb-10">

          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Find Your Perfect Stay
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Find a Place That Fits Your Comfort
          </h2>

          <p className="text-text-secondary mt-3">
            Explore different types of stays for your next getaway.
          </p>

        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-52 bg-surface rounded-xl animate-pulse"
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
          <p className="text-center text-text-secondary py-10">
            No categories available right now.
          </p>
        )}

        {/* Category Grid */}
        {!isLoading && !errorMsg && categories.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">

              {categories.slice(0, 6).map((category, index) => {

                const imageUrl = getImageUrl(category.image);

                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className={`group relative h-56 md:h-52 rounded-xl overflow-hidden ${
                      gridClasses[index] || "md:col-span-1"
                    }`}
                  >

                    {/* Image */}
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={category.name || "Category"}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <span className="text-text-primary font-semibold">
                          {category.name}
                        </span>
                      </div>
                    )}

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent group-hover:from-black/85 transition-all duration-300" />

                    {/* Category Name */}
                    <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                      <h3 className="text-white text-lg font-bold capitalize">
                        {category.name}
                      </h3>
                    </div>

                  </Link>
                );
              })}

            </div>

            {/* Explore More */}
            <div className="flex justify-center mt-10">

              <Link
                href="/categories"
                className="inline-flex items-center gap-3 bg-primary text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 group"
              >
                Explore More Categories

                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default CategoryShowcase;
