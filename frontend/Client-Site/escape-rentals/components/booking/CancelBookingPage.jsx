
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LuArrowLeft,
  LuCalendarDays,
  LuMapPin,
  LuTrash2,
} from "react-icons/lu";

import axiosNew from "@/utils/axiosNew";

const CancelBookingPage = () => {
  const { bookingId } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Fetch booking
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await axiosNew.get(`/booking/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBooking(response.data?.data || response.data);
      } catch (err) {
        console.error("Fetch booking error:", err);

        setError(
          err.response?.data?.detail || "Unable to fetch booking."
        );
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, router]);

  // Cancel booking
  const handleCancelBooking = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      // PUT request to cancel booking
      const response = await axiosNew.put(
        `/booking/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      

      router.push("/my-bookings");
    } catch (err) {
     

      setError(
        err.response?.data?.detail || "Unable to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-secondary">Loading booking...</p>
      </div>
    );
  }

  // Error
  if (error && !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-xl bg-white p-6 text-center shadow">
          <p className="text-danger">{error}</p>

          <Link
            href="/my-bookings"
            className="mt-4 inline-block text-primary underline"
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border/60 bg-white p-6 shadow-sm sm:p-8">

        {/* Back Button */}
        <Link
          href="/my-bookings"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <LuArrowLeft />
          Back to My Bookings
        </Link>

        {/* Heading */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger">
            <LuTrash2 size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-text-primary">
            Cancel Booking
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Are you sure you want to cancel this booking?
          </p>
        </div>

        {/* Booking Details */}
        <div className="mt-7 rounded-xl bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Booking #{booking.id}
          </p>

          <h2 className="mt-2 text-lg font-bold text-text-primary">
            {booking.property?.name || `Property #${booking.property_id}`}
          </h2>

          <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
            <LuMapPin className="text-primary" />
            {booking.property?.location || "Location not available"}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <p className="flex items-center gap-2 text-xs text-text-secondary">
                <LuCalendarDays className="text-primary" />
                Check-in
              </p>

              <p className="mt-2 text-sm font-semibold text-text-primary">
                {formatDate(booking.check_in)}
              </p>
            </div>

            <div>
              <p className="flex items-center gap-2 text-xs text-text-secondary">
                <LuCalendarDays className="text-primary" />
                Check-out
              </p>

              <p className="mt-2 text-sm font-semibold text-text-primary">
                {formatDate(booking.check_out)}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs text-text-secondary">
              Total Amount
            </p>

            <p className="mt-1 text-2xl font-bold text-primary">
              ₹{Number(booking.total_price || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/my-bookings"
            className="flex items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-primary transition hover:bg-background"
          >
            Keep Booking
          </Link>

          <button
            type="button"
            onClick={handleCancelBooking}
            disabled={
              cancelling ||
              booking.status?.toLowerCase() === "cancelled" ||
              booking.status?.toLowerCase() === "completed"
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LuTrash2 size={16} />

            {cancelling
              ? "Cancelling..."
              : booking.status?.toLowerCase() === "cancelled"
                ? "Already Cancelled"
                : booking.status?.toLowerCase() === "completed"
                  ? "Completed"
                  : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CancelBookingPage;
