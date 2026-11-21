import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { LuMail, LuLock, LuLogIn } from "react-icons/lu";
import axiosNew from "../utils/axiosNew";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8F5] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#E5EAE5] bg-white p-7 shadow-[0_12px_40px_rgba(55,80,65,0.08)] sm:p-10">
        {/* Brand */}
        <div className="mb-9 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#789985] text-2xl font-bold text-white">
            E
          </div>

          <span className="text-xl font-bold tracking-tight text-[#263D33]">
            EscapeRentals
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#263D33]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-[#78877E]">
            Sign in to access your admin dashboard.
          </p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axiosNew.post("users/login/admin", {
                email: values.email,
                password: values.password,
              });

              // JWT token save
              localStorage.setItem("access_token", response.data.access_token);
              localStorage.setItem("refresh_token", response.data.refresh_token);

              console.log("Login successful:", response.data);

              navigate("/");
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
                  className="mb-2 block text-sm font-semibold text-[#263D33]"
                >
                  Email Address
                </label>

                <div
                  className={`flex items-center rounded-xl border bg-[#F7F8F5] px-4 transition-all duration-200 focus-within:border-[#789985] focus-within:ring-4 focus-within:ring-[#789985]/10 ${
                    touched.email && errors.email
                      ? "border-red-400"
                      : "border-[#E5EAE5]"
                  }`}
                >
                  <LuMail className="shrink-0 text-[#789985]" size={19} />

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-[#263D33] outline-none placeholder:text-[#9AA69F]"
                  />
                </div>

                {errors.email && touched.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#263D33]"
                >
                  Password
                </label>

                <div
                  className={`flex items-center rounded-xl border bg-[#F7F8F5] px-4 transition-all duration-200 focus-within:border-[#789985] focus-within:ring-4 focus-within:ring-[#789985]/10 ${
                    touched.password && errors.password
                      ? "border-red-400"
                      : "border-[#E5EAE5]"
                  }`}
                >
                  <LuLock className="shrink-0 text-[#789985]" size={19} />

                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-[#263D33] outline-none placeholder:text-[#9AA69F]"
                  />
                </div>

                {errors.password && touched.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#789985] px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#789985]/20 transition-all duration-200 hover:bg-[#526F5E] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
                <LuLogIn size={18} />
              </button>
            </form>
          )}
        </Formik>

        {/* Footer */}
        <div className="mt-9 border-t border-[#E5EAE5] pt-5 text-center">
          <p className="text-xs text-[#78877E]">
            © 2026 EscapeRentals. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
