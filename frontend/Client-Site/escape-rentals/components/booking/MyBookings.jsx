
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LuCalendarDays,
  LuMapPin,
  LuUsers,
  LuArrowRight,
  LuPencil,
  LuX,
} from "react-icons/lu";
import axiosNew from "@/utils/axiosNew";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Image URL
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.jpg";
    if (image.startsWith("http")) return image;

    const baseURL = axiosNew.defaults.baseURL;

    return new URL(
      image.replace(/^\/+/, ""),
      baseURL.endsWith("/") ? baseURL : `${baseURL}/`
    ).href;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Please login to view your bookings.");
          return;
        }

        const response = await axiosNew.get("/booking/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const bookingData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        setBookings(bookingData);
      } catch (error) {
        console.error("Booking fetch error:", error);

        setError(
          error.response?.data?.detail ||
            "Unable to fetch bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center bg-background">
        <p className="text-text-secondary">
          Loading bookings...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex min-h-[300px] items-center justify-center bg-background px-4">
        <p className="rounded-xl border border-danger/20 bg-white px-6 py-4 text-sm text-danger shadow-sm">
          {error}
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-background px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Your trips
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            My Bookings
          </h1>

          <p className="mt-2 text-text-secondary">
            View and manage your property bookings.
          </p>

          <p className="mt-4 text-sm font-semibold text-text-secondary">
            {bookings.length} Total Bookings
          </p>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-text-primary">
              No bookings found
            </h2>

            <p className="mt-2 text-text-secondary">
              You haven't booked any properties yet.
            </p>

            <Link
              href="/properties"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Explore Properties
              <LuArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">

            {bookings.map((booking) => {
              const property = booking.property;

              return (
                <div
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Property Image */}
                  <div className="relative h-56 overflow-hidden bg-surface">
                    <img
                      src={getImageUrl(property?.cover_image)}
                      alt={property?.name || "Property"}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />

                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                        booking.status?.toLowerCase() === "confirmed"
                          ? "bg-success/10 text-success"
                          : booking.status?.toLowerCase() === "cancelled"
                            ? "bg-danger/10 text-danger"
                            : "bg-warning/10 text-warning"
                      }`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  {/* Booking Details */}
                  <div className="p-5">

                    {/* Booking ID */}
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      Booking #{booking.id}
                    </p>

                    {/* Property Name */}
                    <h2 className="text-xl font-bold text-text-primary">
                      {property?.name || `Property #${booking.property_id}`}
                    </h2>

                    {/* Location */}
                    <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                      <LuMapPin className="shrink-0 text-primary" />
                      {property?.location || "Location not available"}
                    </p>

                    {/* Category / Guest Capacity */}
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-text-secondary">
                      <span className="flex items-center gap-2">
                        <LuUsers className="text-primary" />
                        {booking.guests} Guests
                      </span>

                      <span>
                        Capacity: {property?.guest_capacity || "N/A"}
                      </span>
                    </div>

                    {/* Check-in / Check-out */}
                    <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-background p-4">

                      <div>
                        <p className="mb-2 flex items-center gap-2 text-xs font-medium text-text-secondary">
                          <LuCalendarDays className="text-primary" />
                          Check-in
                        </p>

                        <p className="text-sm font-semibold text-text-primary">
                          {formatDate(booking.check_in)}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 flex items-center gap-2 text-xs font-medium text-text-secondary">
                          <LuCalendarDays className="text-primary" />
                          Check-out
                        </p>

                        <p className="text-sm font-semibold text-text-primary">
                          {formatDate(booking.check_out)}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                      <div>
                        <p className="text-xs text-text-secondary">
                          Total Booking Amount
                        </p>

                        <p className="mt-1 text-2xl font-bold text-primary">
                          ₹{Number(booking.total_price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <Link
                        href={`/properties/${booking.property_id}`}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
                      >
                        View Property
                        <LuArrowRight size={16} />
                      </Link>
                    </div>

                    {/* Update and Cancel Buttons */}
                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <Link
                        href={`/update-booking/${booking.id}`}
                        className="flex items-center justify-center gap-2 rounded-xl border border-primary px-3 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                      >
                        <LuPencil size={17} />
                        Update Booking
                      </Link>

                      <Link
                        href={`/cancel-booking/${booking.id}`}
                        className="flex items-center justify-center gap-2 rounded-xl border border-danger px-3 py-3 text-sm font-semibold text-danger transition hover:bg-danger hover:text-white"
                      >
                        <LuX size={17} />
                        Cancel Booking
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

export default MyBookings;
