
"use client";

import axiosNew from "@/utils/axiosNew";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaSlidersH,
  FaSortAmountDown,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";
import SinglePropertyCard from "../common/SinglePropertyCard";

const CategoryProperties = ({ categoryId }) => {
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (!categoryId) return;

    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setErrorMsg("");

        const res = await axiosNew.get(
          `/properties/category/${categoryId}`
        );

        setProperties(res.data.data || []);
      } catch (err) {
        setErrorMsg(
          err.response?.data?.detail || "Unable to load properties."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [categoryId]);

  const categoryName =
    properties[0]?.category?.name ||
    properties[0]?.category_name ||
    properties[0]?.category?.title ||
    "Explore Properties";

  const sortedProperties = [...properties].sort((a, b) => {
    if (sortBy === "low") {
      return Number(a.price_per_night) - Number(b.price_per_night);
    }

    if (sortBy === "high") {
      return Number(b.price_per_night) - Number(a.price_per_night);
    }

    if (sortBy === "rating") {
      return Number(b.rating || 0) - Number(a.rating || 0);
    }

    return 0;
  });

  return (
    <main className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary-dark px-5 py-14 sm:px-8 lg:px-16">

        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-white/70">
            <button
              onClick={() => router.push("/")}
              className="transition hover:text-white"
            >
              Home
            </button>

            <span>/</span>

            <span className="text-white">Categories</span>
          </div>

          <div className="max-w-2xl">

            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
              <FaHome />
              Discover Your Stay
            </span>

            <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              Explore {categoryName}
            </h1>

            <p className="text-sm leading-7 text-white/75 sm:text-base">
              Find your perfect getaway with our handpicked collection
              of beautiful properties. Comfort, luxury and memorable
              experiences await you.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-white/80">

              <div className="flex items-center gap-2">
                <FaHome className="text-accent" />
                <span>Quality Properties</span>
              </div>

              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-accent" />
                <span>Unique Locations</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="px-5 py-12 sm:px-8 lg:px-16">

        <div className="mx-auto max-w-7xl">

          {/* Section Header */}
          <div className="mb-8 flex flex-col justify-between gap-5 border-b border-border pb-6 sm:flex-row sm:items-end">

            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
                Find Your Perfect Stay
              </p>

              <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
                Available Properties
              </h2>

              <p className="mt-2 text-sm text-text-secondary">
                Explore stays that match your preferences.
              </p>
            </div>

            {!isLoading && !errorMsg && (
              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-surface px-4 py-2.5 shadow-sm">
                  <p className="text-xl font-bold text-primary-dark">
                    {properties.length}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Total Stays
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-3">
                  <FaSortAmountDown className="text-primary" />

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="max-w-40 bg-transparent text-sm font-medium text-text-primary outline-none"
                  >
                    <option value="default">Sort By</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

              </div>
            )}

          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-2xl bg-border/60"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && errorMsg && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-14 text-center">
              <h3 className="mb-2 text-xl font-bold text-red-700">
                Something went wrong
              </h3>
              <p className="text-sm text-red-600">{errorMsg}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !errorMsg && properties.length === 0 && (
            <div className="rounded-2xl border border-border bg-surface px-5 py-20 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
                <FaHome />
              </div>

              <h3 className="mb-2 text-2xl font-bold text-text-primary">
                No Properties Found
              </h3>

              <p className="mx-auto max-w-md text-sm leading-6 text-text-secondary">
                We couldn't find any properties in this category right now.
                Please explore other categories.
              </p>

              <button
                onClick={() => router.push("/categories")}
                className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Explore Categories
              </button>

            </div>
          )}

          {/* Property Cards */}
          {!isLoading && !errorMsg && sortedProperties.length > 0 && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Showing <span className="font-bold text-text-primary">
                    {sortedProperties.length}
                  </span> properties
                </p>
              </div>

              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {sortedProperties.map((property) => (
                  <SinglePropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            </>
          )}

          {/* Back Button */}
          <div className="mt-12">
            <button
              onClick={() => router.push("/categories")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-dark"
            >
              <FaArrowLeft />
              Back to All Categories
            </button>
          </div>

        </div>
      </section>
    </main>
  );
};

export default CategoryProperties;
