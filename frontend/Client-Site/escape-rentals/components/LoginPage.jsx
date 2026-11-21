"use client";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { LuMail, LuLock, LuLogIn } from "react-icons/lu";

import { useRouter } from "next/navigation";

import axiosNew from "@/utils/axiosNew";

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    // .min(8, "Password must be at least 8 characters")
    // .matches(/[A-Z]/, "At least one uppercase letter required")
    // .matches(/[a-z]/, "At least one lowercase letter required")
    // .matches(/[0-9]/, "At least one number required")
    // .matches(/[@$!%*?&#]/, "At least one special character required")
    .required("Password is required"),
});

const LoginPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-white p-7 shadow-[0_18px_55px_rgba(76,53,39,0.10)] sm:p-10">
        {/* Brand */}
        <div className="mb-9 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-white shadow-sm">
            E
          </div>

          <span className="text-xl font-semibold tracking-tight text-text-primary">
            EscapeRentals
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Sign in to access your admin dashboard.
          </p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axiosNew.post("users/login", {
                email: values.email,
                password: values.password,
              });

              // JWT token save
              localStorage.setItem("access_token", response.data.access_token);
              localStorage.setItem("refresh_token",response.data.refresh_token,);

              console.log("Login successful:", response.data);

              router.push("/");
            } catch (error) {
              alert(
                error.response?.data?.detail || "Invalid email or password",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-text-primary"
                >
                  Email Address
                </label>

                <div
                  className={`flex items-center rounded-xl border bg-background px-4 transition-all duration-200 focus-within:border-primary ${
                    touched.email && errors.email
                      ? "border-danger"
                      : "border-border/70"
                  }`}
                >
                  <LuMail className="shrink-0 text-primary" size={19} />

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-text-primary outline-none placeholder:text-text-secondary/60"
                  />
                </div>

                {errors.email && touched.email && (
                  <p className="mt-1.5 text-xs font-medium text-danger">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-text-primary"
                >
                  Password
                </label>

                <div
                  className={`flex items-center rounded-xl border bg-background px-4 transition-all duration-200 focus-within:border-primary ${
                    touched.email && errors.email
                      ? "border-danger"
                      : "border-border/70"
                  }`}
                >
                  <LuLock className="shrink-0 text-primary" size={19} />

                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-text-primary outline-none placeholder:text-text-secondary/60"
                  />
                </div>

                {errors.password && touched.password && (
                  <p className="mt-1.5 text-xs font-medium text-danger">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:bg-primary-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
                <LuLogIn size={18} />
              </button>
            </form>
          )}
        </Formik>

        {/* Registration Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/registration")}
              className="font-semibold text-primary transition hover:text-primary-dark hover:underline"
            >
              Register Now
            </button>
          </p>
        </div>
        {/* Footer */}
        <div className="mt-9 border-t border-border/60 pt-5 text-center">
          <p className="text-xs text-text-secondary">
            © 2026 EscapeRentals. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
