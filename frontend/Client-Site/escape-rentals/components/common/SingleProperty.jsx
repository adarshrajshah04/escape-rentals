
"use client";

import axiosNew from "@/utils/axiosNew";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchReview } from "@/redux/action/review.action";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaHome,
  FaImages,
  FaMapMarkerAlt,
  FaStar,
  FaTimesCircle,
  FaUsers,
  FaHeart,
  FaRegHeart,
  FaCalendarCheck,
} from "react-icons/fa";

// Map component
const PropertyLocationMap = dynamic(
  () => import("@/components/common/PropertyLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[350px] items-center justify-center rounded-2xl bg-[#F0E9E0]">
        <p className="text-sm font-medium text-[#6B625C]">
          Loading property map...
        </p>
      </div>
    ),
  }
);

// Format price
const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN");

// Format review date
const formatReviewDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? ""
    : parsedDate.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const SingleProperty = ({ propertyId }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux reviews
  const {
    review,
    isLoading: reviewsLoading,
    errorMsg: reviewsError,
  } = useSelector((state) => state.review);

  // Property states
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Wishlist states
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Fetch reviews
  useEffect(() => {
    dispatch(fetchReview());
  }, [dispatch]);

  // Fetch property details
  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      setError("Property details are unavailable.");
      return;
    }

    let cancelled = false;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosNew.get(
          `/properties/${propertyId}`
        );

        if (!cancelled) {
          setProperty(response.data.data || response.data);
          setSelectedImage(0);
        }
      } catch (fetchError) {
        console.error("Property Fetch Error:", fetchError);

        if (!cancelled) {
          setError(
            fetchError.response?.data?.detail ||
              "Unable to load property details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProperty();

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  // Check wishlist status
  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("access_token");

      if (!token || !property?.id) {
        setIsWishlisted(false);
        return;
      }

      try {
        const response = await axiosNew.get(
          `/wishlist/check/${property.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsWishlisted(response.data.is_wishlisted);
      } catch (error) {
        console.error("Wishlist Check Error:", error);
      }
    };

    checkWishlist();
  }, [property?.id]);

  // Image URL helper
  const getImageUrl = (path) => {
    if (!path) return "";

    if (path.startsWith("http")) return path;

    const baseURL = axiosNew.defaults.baseURL;

    return new URL(
      path.replace(/^\/+/, ""),
      baseURL.endsWith("/") ? baseURL : `${baseURL}/`
    ).href;
  };

  // Add / Remove wishlist
  const toggleWishlist = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!property?.id || wishlistLoading) return;

    try {
      setWishlistLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (isWishlisted) {
        await axiosNew.delete(
          `/wishlist/${property.id}`,
          config
        );

        setIsWishlisted(false);
      } else {
        await axiosNew.post(
          `/wishlist/${property.id}`,
          {},
          config
        );

        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Wishlist Error:", error);

      alert(
        error.response?.data?.detail ||
          "Unable to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // Booking navigation
  const handleBooking = () => {
    if (!property?.id || !property.is_active) return;

    router.push(`/booking/${property.id}`);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF5EF] px-5 pt-24">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#E8D9C7] border-t-[#A6533C]" />

          <p className="font-semibold text-[#34302D]">
            Loading your stay...
          </p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error || !property) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF5EF] px-5 pt-24">
        <div className="w-full max-w-md rounded-3xl border border-[#E5D7C8] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EDE5] text-2xl text-[#A6533C]">
            <FaHome />
          </div>

          <h1 className="text-2xl font-bold text-[#34302D]">
            Property not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6B625C]">
            {String(error || "Property details are unavailable.")}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#A6533C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#87412F]"
          >
            <FaArrowLeft />
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Property images
  const propertyImages = [
    property.cover_image,
    ...(Array.isArray(property.images) ? property.images : []),
  ]
    .filter(Boolean)
    .filter(
      (image, index, array) => array.indexOf(image) === index
    )
    .slice(0, 5);

  const activeImageIndex = Math.min(
    selectedImage,
    Math.max(propertyImages.length - 1, 0)
  );

  const categoryName =
    property.category_name ||
    property.category?.name ||
    "Holiday stay";

  const isActive = Boolean(property.is_active);

  // Get review data
  const reviewData = Array.isArray(review?.data)
    ? review.data
    : Array.isArray(review)
      ? review
      : [];

  // Filter reviews for current property
  const propertyReviews = reviewData.filter((item) => {
    const associatedPropertyId =
      item.property_id ??
      item.property?.id ??
      item.property?.property_id ??
      item.propertyId;

    if (
      associatedPropertyId !== null &&
      associatedPropertyId !== undefined
    ) {
      return (
        String(associatedPropertyId) === String(property.id)
      );
    }

    return (
      typeof item.property_name === "string" &&
      item.property_name.trim().toLowerCase() ===
        String(property.name || "").trim().toLowerCase()
    );
  });

  // Sort reviews
  const sortedReviews = [...propertyReviews].sort(
    (first, second) =>
      new Date(second.created_at || 0) -
      new Date(first.created_at || 0)
  );

  // Calculate average rating
  const reviewAverage = propertyReviews.length
    ? propertyReviews.reduce(
        (total, item) =>
          total + (Number(item.rating) || 0),
        0
      ) / propertyReviews.length
    : null;

  const propertyRating = Number(property.rating);

  const displayRating =
    reviewAverage !== null
      ? reviewAverage
      : Number.isFinite(propertyRating) && propertyRating > 0
        ? propertyRating
        : null;

  const totalReviews = propertyReviews.length;

  return (
    <main className="min-h-screen bg-[#FAF5EF] px-4 pb-16 pt-8 text-[#34302D] sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* TOP HEADER */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-[#E5D7C8] bg-white px-4 py-2.5 text-sm font-semibold text-[#6B625C] transition hover:border-[#A6533C] hover:text-[#A6533C]"
          >
            <FaArrowLeft />

            <span className="hidden sm:inline">
              Back to properties
            </span>

            <span className="sm:hidden">Back</span>
          </button>

          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A6533C]">
            Escape Rentals
          </span>
        </div>

        {/* PROPERTY HEADER */}
        <header className="mb-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="mb-3 inline-flex rounded-full bg-[#F0E3D8] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[#87412F]">
              {categoryName}
            </span>

            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {property.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6B625C]">
              <span className="inline-flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#A6533C]" />
                {property.location || "Location not specified"}
              </span>

              {displayRating !== null && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#34302D]">
                  <FaStar className="text-[#D9A441]" />

                  {displayRating.toFixed(1)}

                  <span className="font-normal text-[#6B625C]">
                    ({totalReviews} reviews)
                  </span>
                </span>
              )}
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold ${
              isActive
                ? "bg-[#E8F0E8] text-[#496D50]"
                : "bg-[#F9E9E6] text-[#A44235]"
            }`}
          >
            {isActive ? <FaCheckCircle /> : <FaTimesCircle />}

            {isActive ? "Available" : "Currently unavailable"}
          </span>
        </header>

        {/* PROPERTY GALLERY */}
        <section aria-label="Property photos" className="mb-10">
          {propertyImages.length > 0 ? (
            <>
              <div className="relative h-[260px] overflow-hidden rounded-2xl bg-[#E8D9C7] sm:h-[400px] lg:h-[500px]">
                <Image
                  src={getImageUrl(propertyImages[activeImageIndex])}
                  alt={`${property.name} - photo ${activeImageIndex + 1}`}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />

                <div className="absolute bottom-4 right-4 rounded-lg bg-black/65 px-4 py-2 text-sm font-semibold text-white">
                  {activeImageIndex + 1} / {propertyImages.length}
                </div>
              </div>

              {propertyImages.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {propertyImages.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      aria-label={`Show property photo ${index + 1}`}
                      aria-pressed={activeImageIndex === index}
                      className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-[3px] transition sm:h-24 sm:w-36 ${
                        activeImageIndex === index
                          ? "border-[#A6533C]"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={getImageUrl(image)}
                        alt={`${property.name} - photo ${index + 1}`}
                        fill
                        unoptimized
                        sizes="144px"
                        className="object-cover transition duration-500 hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-[300px] flex-col items-center justify-center gap-3 rounded-3xl bg-[#F0E9E0] text-[#8B7A6D] md:h-[420px]">
              <FaImages className="text-3xl" />
              <p className="text-sm font-medium">
                Photos coming soon
              </p>
            </div>
          )}
        </section>

        {/* MAIN CONTENT + BOOKING CARD */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">

          {/* LEFT CONTENT */}
          <div className="min-w-0">

            {/* ABOUT PROPERTY */}
            <section className="border-b border-[#E5D7C8] pb-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6533C]">
                Your stay
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                A little more about this place
              </h2>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-[#E5D7C8] bg-white px-4 py-3 text-sm font-medium text-[#514943]">
                  <FaUsers className="text-[#A6533C]" />
                  Up to {property.guest_capacity || "—"} guests
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-[#E5D7C8] bg-white px-4 py-3 text-sm font-medium text-[#514943]">
                  <FaHome className="text-[#A6533C]" />
                  {categoryName}
                </div>
              </div>

              <p className="mt-6 whitespace-pre-line text-[15px] leading-8 text-[#6B625C]">
                {property.description ||
                  "A welcoming stay awaits. Contact us to learn more about this property."}
              </p>
            </section>

            {/* PROPERTY DETAILS */}
            <section className="border-b border-[#E5D7C8] py-8">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6533C]">
                  The essentials
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Property details
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#E5D7C8] bg-white p-5">
                  <p className="text-sm text-[#6B625C]">Guests</p>
                  <p className="mt-2 text-lg font-bold">
                    Up to {property.guest_capacity || "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E5D7C8] bg-white p-5">
                  <p className="text-sm text-[#6B625C]">Category</p>
                  <p className="mt-2 text-lg font-bold">
                    {categoryName}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E5D7C8] bg-white p-5">
                  <p className="text-sm text-[#6B625C]">Guest rating</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-lg font-bold">
                    {displayRating !== null ? (
                      <>
                        <FaStar className="text-[#D9A441]" />
                        {displayRating.toFixed(1)}
                      </>
                    ) : (
                      "Not rated yet"
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E5D7C8] bg-white p-5">
                  <p className="text-sm text-[#6B625C]">Availability</p>
                  <p
                    className={`mt-2 text-lg font-bold ${
                      isActive ? "text-[#496D50]" : "text-[#A44235]"
                    }`}
                  >
                    {isActive ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>
            </section>

            {/* REVIEWS */}
            <section className="border-b border-[#E5D7C8] py-8" id="reviews">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6533C]">
                    Guest experiences
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Reviews for this stay
                  </h2>
                </div>

                {propertyReviews.length > 0 && (
                  <div className="inline-flex items-center gap-2 text-sm text-[#6B625C]">
                    <FaStar className="text-[#D9A441]" />

                    <span className="font-bold text-[#34302D]">
                      {reviewAverage.toFixed(1)}
                    </span>

                    <span>· {propertyReviews.length} reviews</span>
                  </div>
                )}
              </div>

              {reviewsLoading && propertyReviews.length === 0 ? (
                <p className="rounded-2xl bg-white p-5 text-sm text-[#6B625C]">
                  Loading reviews...
                </p>
              ) : reviewsError && propertyReviews.length === 0 ? (
                <p className="rounded-2xl border border-[#F0D8D2] bg-white p-5 text-sm text-[#A44235]">
                  Reviews could not be loaded right now.
                </p>
              ) : sortedReviews.length > 0 ? (
                <div className="grid gap-4">
                  {sortedReviews.map((item) => {
                    const reviewerImage = item.user_profile_picture
                      ? getImageUrl(item.user_profile_picture)
                      : "";

                    const reviewerName =
                      item.user_name || `Guest #${item.user_id || ""}`;

                    const reviewRating = Math.max(
                      0,
                      Math.min(5, Number(item.rating) || 0)
                    );

                    return (
                      <article
                        key={item.id}
                        className="rounded-2xl border border-[#E5D7C8] bg-white p-5 transition hover:shadow-sm sm:p-6"
                      >
                        <div className="flex items-start gap-4">
                          {reviewerImage ? (
                            <img
                              src={reviewerImage}
                              alt={`${reviewerName}'s profile`}
                              className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#F0E3D8] font-bold text-[#87412F]">
                              {reviewerName.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="font-bold text-[#34302D]">
                                {reviewerName}
                              </h3>

                              {formatReviewDate(item.created_at) && (
                                <time
                                  dateTime={item.created_at}
                                  className="text-xs text-[#8B7A6D]"
                                >
                                  {formatReviewDate(item.created_at)}
                                </time>
                              )}
                            </div>

                            <div
                              className="mt-1 flex gap-1"
                              aria-label={`${reviewRating} out of 5 stars`}
                            >
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={
                                    star <= reviewRating
                                      ? "text-[#D9A441]"
                                      : "text-[#E8D9C7]"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6B625C]">
                          {item.comment || "No written comment provided."}
                        </p>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-[#DCCBBC] bg-white/70 p-6 text-sm text-[#6B625C]">
                  No reviews for this property yet.
                </p>
              )}
            </section>

            {/* LOCATION MAP */}
            <section className="pt-8" id="location">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6533C]">
                  Find your way
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Where you'll be
                </h2>

                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#6B625C]">
                  <FaMapMarkerAlt className="text-[#A6533C]" />
                  {property.location || "Location not specified"}
                </p>
              </div>

              <PropertyLocationMap
                location={property.location}
                propertyName={property.name}
                latitude={property.latitude}
                longitude={property.longitude}
              />

              <p className="mt-3 text-xs text-[#8B7A6D]">
                Map data © OpenStreetMap contributors
              </p>
            </section>
          </div>

          {/* RIGHT BOOKING CARD */}
          <aside className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-[#E5D7C8] bg-white p-6 shadow-[0_12px_40px_rgba(74,54,38,0.08)]">

              {/* PRICE + RATING */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#6B625C]">
                    A memorable stay from
                  </p>

                  <p className="mt-1 text-3xl font-bold text-[#A6533C]">
                    ₹{formatPrice(property.price_per_night)}

                    <span className="ml-1 text-sm font-medium text-[#6B625C]">
                      / night
                    </span>
                  </p>
                </div>

                {displayRating !== null && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF5EF] px-2.5 py-1.5 text-sm font-semibold">
                    <FaStar className="text-xs text-[#D9A441]" />
                    {displayRating.toFixed(1)}
                  </span>
                )}
              </div>

              <div className="my-5 border-t border-[#EEE5DC]" />

              {/* PROPERTY INFORMATION */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6B625C]">Guests</span>
                  <span className="font-semibold">
                    Up to {property.guest_capacity || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6B625C]">Reviews</span>
                  <span className="font-semibold">{totalReviews}</span>
                </div>
              </div>

              <div className="my-5 border-t border-[#EEE5DC]" />

              {/* BOOKING BUTTON */}
              <button
                type="button"
                onClick={handleBooking}
                disabled={!isActive}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#A6533C] px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#87412F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6533C] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <FaCalendarCheck />

                {isActive
                  ? "Book This Property"
                  : "Currently Unavailable"}
              </button>

              {/* WISHLIST BUTTON */}
              <button
                type="button"
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                aria-label={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full border px-5 py-4 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6533C] disabled:cursor-not-allowed disabled:opacity-60 ${
                  isWishlisted
                    ? "border-[#A6533C] bg-[#F9E9E6] text-[#A6533C]"
                    : "border-[#E5D7C8] bg-white text-[#514943] hover:border-[#A6533C] hover:text-[#A6533C]"
                }`}
              >
                {isWishlisted ? (
                  <FaHeart className="text-lg" />
                ) : (
                  <FaRegHeart className="text-lg" />
                )}

                {wishlistLoading
                  ? "Please wait..."
                  : isWishlisted
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
              </button>

              {/* LOCATION BUTTON */}
              
              <p className="mt-4 text-center text-xs leading-5 text-[#8B7A6D]">
                {isActive
                  ? "Explore the property and book your next getaway."
                  : "This property is not accepting stays right now."}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default SingleProperty;
