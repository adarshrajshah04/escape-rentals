
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import axiosNew from "@/utils/axiosNew";

const SinglePropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.jpg";
    if (image.startsWith("http")) return image;

    const baseURL = axiosNew.defaults.baseURL;

    return new URL(
      image.replace(/^\/+/, ""),
      baseURL.endsWith("/") ? baseURL : `${baseURL}/`
    ).href;
  };

  // CHECK WISHLIST
  useEffect(() => {
    const checkWishlist = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken || !property?.id) return;

      try {
        const response = await axiosNew.get(
          `/wishlist/check/${property.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setIsFavorite(response.data.is_wishlisted);
      } catch (error) {
        console.error("Wishlist check error:", error);
      }
    };

    checkWishlist();
  }, [property.id]);

  // ADD / REMOVE WISHLIST
  const handleWishlist = async () => {
    if (!token) {
      alert("Please login to add properties to your wishlist.");
      return;
    }

    try {
      setWishlistLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (isFavorite) {
        await axiosNew.delete(
          `/wishlist/${property.id}`,
          config
        );

        setIsFavorite(false);
      } else {
        await axiosNew.post(
          `/wishlist/${property.id}`,
          {},
          config
        );

        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Wishlist error:", error);

      alert(
        error.response?.data?.detail || "Unable to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}
      <div className="relative h-60 overflow-hidden">

        <img
          src={getImageUrl(property.cover_image)}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Wishlist */}
        <button
          type="button"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          disabled={wishlistLoading}
          onClick={handleWishlist}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaHeart
            className={
              isFavorite ? "text-red-500" : "text-gray-400"
            }
          />
        </button>

      </div>

      {/* Details */}
      <div className="p-5">

        {/* Category */}
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
          {property.category_name || "Property"}
        </span>

        {/* Name */}
        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-text-primary group-hover:text-primary-dark">
          {property.name}
        </h3>

        {/* Location */}
        <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
          <FaMapMarkerAlt className="text-primary" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {/* Guests */}
        <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
          <FaUsers className="text-primary" />
          <span>Up to {property.guest_capacity} Guests</span>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">

          <div>
            <p className="text-xs text-text-secondary">
              Price per night
            </p>

            <p className="text-xl font-bold text-primary-dark">
              ₹{Number(property.price_per_night).toLocaleString("en-IN")}
            </p>
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            View Details
            <FaArrowRight className="text-xs" />
          </Link>

        </div>

      </div>
    </div>
  );
};

export default SinglePropertyCard;
