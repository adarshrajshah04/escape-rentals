"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "@/redux/action/properties.action";
import SinglePropertyCard from "../common/SinglePropertyCard";
import Loading from "../common/Loading";
import dynamic from "next/dynamic";

const PropertyMain = () => {
  const dispatch = useDispatch();

  const {
    properties = [],
    isLoading,
    errorMsg,
  } = useSelector((state) => state.properties);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch Properties
  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  // Dynamic Categories
  const categories = useMemo(() => {
    return [
      ...new Set(
        properties
          .map((property) => property.category_name || property.category?.name)
          .filter(Boolean),
      ),
    ];
  }, [properties]);

  // Search, Filter and Sort
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Search Filter
    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((property) => {
        return (
          property.name?.toLowerCase().includes(searchValue) ||
          property.location?.toLowerCase().includes(searchValue) ||
          property.description?.toLowerCase().includes(searchValue)
        );
      });
    }

    // Category Filter
    if (category !== "all") {
      result = result.filter((property) => {
        const propertyCategory =
          property.category_name || property.category?.name;

        return propertyCategory?.toLowerCase() === category.toLowerCase();
      });
    }

    // Sorting
    switch (sortBy) {
      case "lowToHigh":
        result.sort(
          (a, b) => Number(a.price_per_night) - Number(b.price_per_night),
        );
        break;

      case "highToLow":
        result.sort(
          (a, b) => Number(b.price_per_night) - Number(a.price_per_night),
        );
        break;

      case "newest":
        result.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
        );
        break;

      default:
        break;
    }

    return result;
  }, [properties, search, category, sortBy]);

  // Clear All Filters
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSortBy("newest");
  };

  const PropertyMap = dynamic(
  () => import("../common/PropertyMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[450px] items-center justify-center rounded-2xl bg-surface text-text-secondary">
        Loading map...
      </div>
    ),
  }
);

  return (
    <section className="min-h-screen bg-background px-4 py-12 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Discover Your Stay
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
            Explore All Properties
          </h1>

          <p className="mt-2 text-text-secondary">
            Find the perfect place for your next getaway.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          {/* All Filters in Single Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Search Property
              </label>

              <div className="flex items-center rounded-xl border border-border/70 px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <span className="mr-2 text-text-secondary">⌕</span>

                <input
                  type="text"
                  placeholder="Search by name, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-text-primary outline-none placeholder:text-text-secondary/60"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Property Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border/70 bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="all">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Sort By
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-border/70 bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="newest">Newest First</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end border-t border-border/60 pt-4">
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-dark"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Property Count */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Available Properties
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Showing {filteredProperties.length} of {properties.length}{" "}
              properties
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && <Loading />}

        {/* Error */}
        {!isLoading && errorMsg && (
          <div className="py-16 text-center text-danger">{errorMsg}</div>
        )}

        {/* Property Cards */}
        {!isLoading &&
          !errorMsg &&
          (filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <SinglePropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border/60 bg-white py-16 text-center">
              <h3 className="text-xl font-semibold text-text-primary">
                No Properties Found
              </h3>

              <p className="mt-2 text-text-secondary">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 rounded-lg bg-primary px-6 py-2.5 text-white transition hover:bg-primary-dark"
              >
                Clear Filters
              </button>
            </div>
          ))}
      </div>


    </section>
  );
};

export default PropertyMain;





//       {/* Properties + Map */}
// {!isLoading && !errorMsg && (
//   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

//     {/* Property Cards */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

//       {filteredProperties.length > 0 ? (
//         filteredProperties.map((property) => (
//           <SinglePropertyCard
//             key={property.id}
//             property={property}
//           />
//         ))
//       ) : (
//         <p className="text-gray-500 col-span-2 text-center py-10">
//           No Properties Found
//         </p>
//       )}

//     </div>

//     {/* Map */}
//     <div className="lg:sticky lg:top-24">
//       <PropertyMap properties={filteredProperties} />
//     </div>

//   </div>
// )}