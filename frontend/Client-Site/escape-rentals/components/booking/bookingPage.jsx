"use client";

import React, { useEffect, useState } from "react";
import {  useRouter } from "next/navigation";
import axiosNew from "@/utils/axiosNew";

import {
  LuCalendarDays,
  LuUsers,
  LuMapPin,
  LuArrowLeft,
  LuCreditCard,
  LuShieldCheck,
} from "react-icons/lu";
import Loading from "../common/Loading";

const BookingPage = ({propertyId}) => {
    console.log(propertyId);
    
  const router = useRouter();
  


  const [property, setProperty] = useState(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");

  // Today's date
  const today = new Date().toISOString().split("T")[0];

  // Fetch Property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axiosNew.get(
          `/properties/${propertyId}`
        );

        const propertyData =
          response.data?.data || response.data;

        setProperty(propertyData);
      } catch (error) {
        console.error("Property Error:", error);

        setError(
          error.response?.data?.detail ||
          "Unable to load property details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  // Calculate Nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);

    return Math.max(
      0,
      Math.round((end - start) / (1000 * 60 * 60 * 24))
    );
  };

  const nights = calculateNights();

  const pricePerNight = Number(
    property?.price_per_night || 0
  );

  const totalPrice = pricePerNight * nights;

  // Load Razorpay Checkout SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // Booking and Payment
  const handleBooking = async () => {
    try {
      setError("");

      if (!checkIn || !checkOut) {
        setError("Please select check-in and check-out dates.");
        return;
      }

      if (new Date(`${checkIn}T00:00:00`) < new Date(`${today}T00:00:00`)) {
        setError("Check-in date cannot be in the past.");
        return;
      }

      if (nights <= 0) {
        setError("Check-out must be after check-in.");
        return;
      }

      if (
        !guests ||
        guests < 1 ||
        guests > Number(property.guest_capacity)
      ) {
        setError("Please select a valid number of guests.");
        return;
      }

      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push(
          `/login?redirect=/booking/${propertyId}`
        );
        return;
      }

      setPaymentLoading(true);

      // Step 1: Create Razorpay Order
      const orderResponse = await axiosNew.post(
        "/payment/create-order",
        {
          property_id: Number(propertyId),
          check_in: checkIn,
          check_out: checkOut,
          guests: Number(guests),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const order = orderResponse.data;

      // Step 2: Load Razorpay
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error("Unable to load Razorpay checkout.");
      }

      // Step 3: Razorpay Checkout Options
      const options = {
        key: order.razorpay_key_id,

        amount: order.amount,

        currency: order.currency,

        name: "EscapeRentals",

        description: `Booking for ${property.name}`,

        order_id: order.razorpay_order_id,

        theme: {
          color: "#A6533C",
        },

        handler: async function (paymentResponse) {
          try {
            // Step 4: Verify Payment
            const verifyResponse = await axiosNew.post(
              "/payment/verify",
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyResponse.data) {
              alert("Payment successful! Booking confirmed.");

              router.push("/my-bookings");
            }
          } catch (error) {
            console.error("Payment Verification Error:", error);

            alert(
              error.response?.data?.detail ||
              "Payment verification failed. Please contact support."
            );
          } finally {
            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      };

      // Step 5: Open Razorpay
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);

        setPaymentLoading(false);

        alert(
          response.error?.description ||
          "Payment failed. Please try again."
        );
      });

      razorpay.open();

    } catch (error) {
      console.error("Booking Error:", error);

      setError(
        error.response?.data?.detail ||
        error.message ||
        "Unable to process booking."
      );

      setPaymentLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loading text="Loading booking details..."/>
      </div>
    );
  }

  // Property Not Found
  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-danger">
          {error || "Property not found."}
        </p>

        <button
          onClick={() => router.back()}
          className="rounded-lg bg-primary px-5 py-2 text-white transition hover:bg-primary-dark"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-7 flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
        >
          <LuArrowLeft size={18} />
          Back to Property
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Confirm Your Booking
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Complete your booking details and proceed to payment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Booking Form */}
          <div className="space-y-6 lg:col-span-2">

            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-lg font-semibold text-text-primary">
                Your Trip Details
              </h2>

              {/* Check-in */}
              <div className="mb-5">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                  <LuCalendarDays className="text-primary" />
                  Check-in Date
                </label>

                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);

                    if (
                      checkOut &&
                      e.target.value >= checkOut
                    ) {
                      setCheckOut("");
                    }
                  }}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Check-out */}
              <div className="mb-5">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                  <LuCalendarDays className="text-primary" />
                  Check-out Date
                </label>

                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  disabled={!checkIn}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                  <LuUsers className="text-primary" />
                  Number of Guests
                </label>

                <select
                  value={guests}
                  onChange={(e) =>
                    setGuests(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  {Array.from(
                    {
                      length: Math.max(
                        0,
                        Number(property.guest_capacity || 0)
                      ),
                    },
                    (_, index) => index + 1
                  ).map((number) => (
                    <option key={number} value={number}>
                      {number} {number === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-text-secondary">
                  Maximum capacity: {property.guest_capacity} guests
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-5 rounded-xl bg-danger/10 p-3 text-sm text-danger">
                  {error}
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <LuCreditCard size={22} />
                </div>

                <div>
                  <h2 className="font-semibold text-text-primary">
                    Secure Payment
                  </h2>

                  <p className="text-xs text-text-secondary">
                    Payment securely processed by Razorpay.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-text-secondary">
                <LuShieldCheck className="text-primary" size={18} />
                Your payment details are securely processed.
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div>
            <div className="sticky top-6 rounded-2xl border border-border/60 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-text-primary">
                Booking Summary
              </h2>

              {/* Property */}
              <div className="mb-5 flex gap-4">

                {property.cover_image && (
                  <img
                    src={
                      property.cover_image.startsWith("http")
                        ? property.cover_image
                        : `${axiosNew.defaults.baseURL}${property.cover_image.replace(/^\/+/, "")}`
                    }
                    alt={property.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                )}

                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">
                    {property.name}
                  </h3>

                  <p className="mt-2 flex items-center gap-1 text-xs text-text-secondary">
                    <LuMapPin size={14} />
                    {property.location}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-primary">
                    ₹{pricePerNight.toLocaleString("en-IN")} / night
                  </p>
                </div>
              </div>

              <div className="border-t border-border/60 py-5">

                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-text-secondary">
                    Check-in
                  </span>

                  <span className="font-medium text-text-primary">
                    {checkIn || "Not selected"}
                  </span>
                </div>

                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-text-secondary">
                    Check-out
                  </span>

                  <span className="font-medium text-text-primary">
                    {checkOut || "Not selected"}
                  </span>
                </div>

                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-text-secondary">
                    Guests
                  </span>

                  <span className="font-medium text-text-primary">
                    {guests}
                  </span>
                </div>

                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-text-secondary">
                    Total Nights
                  </span>

                  <span className="font-medium text-text-primary">
                    {nights}
                  </span>
                </div>

                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-text-secondary">
                    Price per night
                  </span>

                  <span className="font-medium text-text-primary">
                    ₹{pricePerNight.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="border-t border-border/60 pt-5">

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary">
                    Total Amount
                  </span>

                  <span className="text-2xl font-bold text-primary">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="mt-2 text-xs text-text-secondary">
                  Final amount is calculated and validated by the server.
                </p>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handleBooking}
                disabled={
                  paymentLoading ||
                  !checkIn ||
                  !checkOut ||
                  nights <= 0
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paymentLoading ? (
                  "Processing..."
                ) : (
                  <>
                    Pay ₹{totalPrice.toLocaleString("en-IN")}
                    <LuCreditCard size={18} />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-text-secondary">
                You will be redirected to secure Razorpay checkout.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;