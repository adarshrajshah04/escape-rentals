
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LuHeart, LuTrash2, LuMapPin, LuUsers } from "react-icons/lu";
import axiosNew from "@/utils/axiosNew";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const getImageUrl = (image) => {
    if (!image) return "/default-property.png";

    if (image.startsWith("http")) return image;

    return `${axiosNew.defaults.baseURL.replace(/\/?$/, "/")}${image.replace(/^\/+/, "")}`;
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axiosNew.get("/wishlist/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist(response.data.data || []);
    } catch (error) {
      console.error("Wishlist error:", error);
      setError(
        error.response?.data?.detail || "Unable to fetch wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeWishlist = async (propertyId) => {
    try {
      setRemovingId(propertyId);

      const token = localStorage.getItem("access_token");

      await axiosNew.delete(`/wishlist/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist((prev) =>
        prev.filter((item) => item.property_id !== propertyId)
      );
    } catch (error) {
      alert(
        error.response?.data?.detail || "Unable to remove property."
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <p className="text-text-secondary">Loading wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary">
              <LuHeart size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                My Wishlist
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                Your saved properties in one place.
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm font-medium text-text-secondary">
            {wishlist.length} Saved Properties
          </p>
        </div>

        {/* Empty Wishlist */}
        {wishlist.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-white px-5 py-16 text-center">
            <LuHeart size={45} className="mx-auto text-secondary" />

            <h2 className="mt-5 text-xl font-bold text-text-primary">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Save your favorite properties to find them easily later.
            </p>

            <Link
              href="/properties"
              className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Explore Properties
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {wishlist.map((item) => (
              <div
                key={item.wishlist_id}
                className="group overflow-hidden rounded-2xl border border-border/50 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-surface">
                  <img
                    src={getImageUrl(item.cover_image)}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    onClick={() => removeWishlist(item.property_id)}
                    disabled={removingId === item.property_id}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-md transition hover:bg-primary hover:text-white disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    <LuTrash2 size={19} />
                  </button>

                  {!item.is_active && (
                    <span className="absolute bottom-4 left-4 rounded-full bg-danger px-3 py-1 text-xs font-semibold text-white">
                      Unavailable
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {item.category_name || "Property"}
                  </p>

                  <h2 className="mt-2 line-clamp-1 text-xl font-bold text-text-primary">
                    {item.name}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                    <LuMapPin size={16} className="shrink-0 text-primary" />
                    <span className="line-clamp-1">{item.location}</span>
                  </p>

                  <p className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
                    <LuUsers size={17} className="text-primary" />
                    Up to {item.guest_capacity} Guests
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
                    <div>
                      <p className="text-xl font-bold text-primary">
                        ₹{Number(item.price_per_night).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-text-secondary">
                        per night
                      </p>
                    </div>

                    <Link
                      href={`/properties/${item.property_id}`}
                      className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
