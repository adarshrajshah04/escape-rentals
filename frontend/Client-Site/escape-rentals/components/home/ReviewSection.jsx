
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReview } from "@/redux/action/review.action";
import { BASE_URL } from "@/utils/axiosNew";
import { FaStar } from "react-icons/fa";

const ReviewSection = () => {
  const dispatch = useDispatch();

  const { review, isLoading, errorMsg } = useSelector(
    (state) => state.review
  );

  useEffect(() => {
    dispatch(fetchReview());
  }, [dispatch]);

  const reviewData = Array.isArray(review?.data)
    ? review.data
    : Array.isArray(review)
      ? review
      : [];

  const reviews = [...reviewData]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-8 lg:px-16">

      <div className="mb-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          Hear From Our Hosts
        </h2>

        <p className="mt-3 text-sm text-text-secondary sm:text-base">
          The biggest reward is to satisfy our clients and share their
          experience with us
        </p>
      </div>

      {isLoading ? (
        <p className="text-center">Loading reviews...</p>
      ) : errorMsg ? (
        <p className="text-center text-danger">{errorMsg}</p>
      ) : reviews.length > 0 ? (

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 sm:grid-cols-3">

          {reviews.map((item) => {
            const imageUrl = item.user_profile_picture
              ? item.user_profile_picture.startsWith("http")
                ? item.user_profile_picture
                : new URL(
                    item.user_profile_picture.replace(/^\/+/, ""),
                    BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`
                  ).href
              : null;

            return (
              <div
                key={item.id}
                className="flex flex-col items-center text-center"
              >

                <div className="relative flex min-h-[130px] w-full items-center justify-center rounded-2xl border border-border/60 bg-background px-5 py-5 shadow-sm">
                  <div>
                    <p className="text-sm leading-6 text-text-primary">
                      {item.comment}
                    </p>

                    <div className="mt-2 flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={12}
                          className={
                            star <= item.rating
                              ? "text-warning"
                              : "text-border"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="absolute -bottom-[9px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-border/60 bg-background" />
                </div>

                <div className="relative z-10 mt-5 h-12 w-12 overflow-hidden rounded-full bg-primary/10">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.user_name || "User"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-semibold text-primary">
                      {item.user_name?.charAt(0).toUpperCase() || "G"}
                    </div>
                  )}
                </div>

                <h3 className="mt-3 text-sm font-semibold text-text-primary">
                  {item.user_name}
                </h3>

                <p className="mt-1 text-sm italic text-text-secondary">
                  {item.property_name}
                </p>

              </div>
            );
          })}

        </div>

      ) : (
        <p className="py-10 text-center text-text-secondary">
          No reviews available yet.
        </p>
      )}

    </section>
  );
};

export default ReviewSection;
