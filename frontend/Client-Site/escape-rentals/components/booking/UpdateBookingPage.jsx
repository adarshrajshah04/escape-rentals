
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LuArrowLeft, LuCalendarDays, LuUsers } from "react-icons/lu";
import axiosNew from "@/utils/axiosNew";

const UpdateBookingPage = () => {
  const { bookingId } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
    guests: 1,
  });

  // Fetch single booking
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

        const data = response.data?.data || response.data;

        setBooking(data);

        setFormData({
          check_in: data.check_in?.split("T")[0] || "",
          check_out: data.check_out?.split("T")[0] || "",
          guests: data.guests || 1,
        });
      } catch (err) {
        setError(
          err.response?.data?.detail || "Unable to fetch booking."
        );
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId, router]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  // Update booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.check_out) <= new Date(formData.check_in)) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    const capacity = booking?.property?.guest_capacity;

    if (capacity && formData.guests > capacity) {
      alert(`Maximum ${capacity} guests allowed.`);
      return;
    }

    try {
      setUpdating(true);

      const token = localStorage.getItem("access_token");

      await axiosNew.put(
        `/booking/${bookingId}`,
        {
          property_id: booking.property_id,
          check_in: formData.check_in,
          check_out: formData.check_out,
          guests: formData.guests,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking updated successfully!");

      router.push("/my-bookings");
    } catch (err) {
      console.error("Update booking error:", err);

      setError(
        err.response?.data?.detail || "Unable to update booking."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-secondary">Loading booking...</p>
      </div>
    );
  }

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
    <section className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-xl">

        <Link
          href="/my-bookings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <LuArrowLeft />
          Back to My Bookings
        </Link>

        <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm sm:p-8">

          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Booking #{booking.id}
          </p>

          <h1 className="mt-2 text-2xl font-bold text-text-primary">
            Update Booking
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            {booking.property?.name || `Property #${booking.property_id}`}
          </p>

          {error && (
            <p className="mt-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">

            {/* Check-in */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                <LuCalendarDays className="text-primary" />
                Check-in Date
              </label>

              <input
                type="date"
                name="check_in"
                value={formData.check_in}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Check-out */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                <LuCalendarDays className="text-primary" />
                Check-out Date
              </label>

              <input
                type="date"
                name="check_out"
                value={formData.check_out}
                onChange={handleChange}
                min={formData.check_in || undefined}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                <LuUsers className="text-primary" />
                Number of Guests
              </label>

              <input
                type="text"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                min="1"
                max={booking.property?.guest_capacity || undefined}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />

              <p className="mt-1 text-xs text-text-secondary">
                Maximum capacity: {booking.property?.guest_capacity || "N/A"}
              </p>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateBookingPage;
