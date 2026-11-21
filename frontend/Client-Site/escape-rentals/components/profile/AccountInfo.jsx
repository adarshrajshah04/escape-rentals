
"use client";

import React, { useEffect, useState } from "react";
import axiosNew from "@/utils/axiosNew";
import Loading from "../common/Loading";

const AccountInfo = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Please login to view your profile.");
          return;
        }

        const response = await axiosNew.get("/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data.data);
      } catch (error) {
        console.error("Profile error:", error);
        setError(
          error.response?.data?.detail || "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const profileImage = profile?.profile_image
    ? profile.profile_image.startsWith("http")
      ? profile.profile_image
      : `${axiosNew.defaults.baseURL.replace(/\/?$/, "/")}${profile.profile_image.replace(/^\/+/, "")}`
    : "/default-profile.png";

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loading/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-background px-4">
        <p className="rounded-xl border border-danger/20 bg-white px-6 py-4 text-sm text-danger shadow-sm">{error}</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-background px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          My Profile
        </h1>

        <p className="mb-8 mt-2 text-text-secondary">
          View your personal information.
        </p>

        <div className="overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm">
          <div className="h-36 bg-gradient-to-r from-primary to-secondary sm:h-40" />

          <div className="px-6 pb-8 sm:px-10">
            <div className="-mt-16 mb-6">
              <img
                src={profileImage}
                alt="Profile"
                className="h-32 w-32 rounded-full border-4 border-white bg-background object-cover shadow-md"
              />
            </div>

            <div className="mb-8 border-b border-border/60 pb-6">
              <h2 className="text-2xl font-semibold capitalize tracking-tight text-text-primary">
                {profile.first_name} {profile.last_name}
              </h2>

              <p className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {profile.is_admin ? "Administrator" : "User"}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/50 bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">First Name</p>
                <p className="mt-2 font-semibold text-text-primary">
                  {profile.first_name}
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Last Name</p>
                <p className="mt-2 font-semibold text-text-primary">
                  {profile.last_name}
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Email Address</p>
                <p className="mt-2 break-all font-semibold text-text-primary">
                  {profile.email}
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Contact Number</p>
                <p className="mt-2 font-semibold text-text-primary">
                  {profile.contact_No}
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Account Status</p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    profile.is_active
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {profile.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountInfo;
