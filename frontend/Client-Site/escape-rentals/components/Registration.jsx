"use client"
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";


import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ImagePlus,
  UserRound,
  X,
} from "lucide-react";
import axiosNew from "@/utils/axiosNew";

// Validation Schema
const userValidationSchema = Yup.object({
  first_name: Yup.string()
    .trim()
    .required("First name is required")
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters"),

  last_name: Yup.string()
    .trim()
    .required("Last name is required")
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),

  contact_No: Yup.string()
    .required("Contact number is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Minimum 8 characters")
    .max(20, "Maximum 20 characters")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "At least one special character required"
    ),

  profile_image: Yup.mixed()
    .required("Profile image is required")
    .test("fileType", "Only JPG, PNG and WEBP allowed", (value) => {
      if (!value) return false;

      return ["image/jpeg", "image/png", "image/webp"].includes(
        value.type
      );
    })
    .test("fileSize", "Image must be less than 2MB", (value) => {
      if (!value) return false;

      return value.size <= 2 * 1024 * 1024;
    }),
});

const CreateUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Submit User Registration
  const handleUserSubmit = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    try {
      setServerError("");
      setSuccessMessage("");

      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axiosNew.post(
        "/users/registration/",
        formData
      );

      setSuccessMessage(
        response.data?.message || "User registered successfully!"
      );

      resetForm();
      setPreview(null);
      setShowPassword(false);
    } catch (error) {
      setServerError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to register user. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border/70 bg-background py-3 pl-11 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-7 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserPlus size={27} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              Add New User
            </h1>

            <p className="mt-1 text-sm text-text-secondary">
              Register a new user account for EscapeRentals.
            </p>
          </div>
        </div>

        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            contact_No: "",
            password: "",
            profile_image: null,
          }}
          validationSchema={userValidationSchema}
          onSubmit={handleUserSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
            resetForm,
          }) => {
            const FieldError = ({ name }) => (
              <p className="mt-1.5 min-h-5 text-xs text-red-500">
                {touched[name] && errors[name] ? errors[name] : ""}
              </p>
            );

            return (
              <form onSubmit={handleSubmit}>
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">

                  {/* Form Heading */}
                  <div className="border-b border-border/60 px-6 py-5">
                    <div className="flex items-center gap-3">
                      <UserRound
                        className="text-primary"
                        size={21}
                      />

                      <div>
                        <h2 className="font-semibold text-text-primary">
                          User Information
                        </h2>

                        <p className="text-xs text-text-secondary">
                          Enter the details to register a new user.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-7 p-6 md:p-8">

                    {/* Profile Image */}
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-text-primary">
                        Profile Picture
                        <span className="text-red-500"> *</span>
                      </label>

                      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-background">
                          {preview ? (
                            <img
                              src={preview}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User
                              size={35}
                              className="text-text-secondary/60"
                            />
                          )}

                          {preview && (
                            <button
                              type="button"
                              onClick={() => {
                                setPreview(null);
                                setFieldValue("profile_image", null);
                                setFieldTouched("profile_image", true);
                              }}
                              className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/70 px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-background">
                            <ImagePlus size={17} />
                            Upload Image

                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(event) => {
                                const file =
                                  event.currentTarget.files?.[0];

                                if (file) {
                                  setFieldValue("profile_image", file);
                                  setPreview(URL.createObjectURL(file));
                                }
                              }}
                            />
                          </label>

                          <p className="mt-2 text-xs text-text-secondary">
                            JPG, PNG or WEBP. Maximum size 2MB.
                          </p>

                          <FieldError name="profile_image" />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border/60" />

                    {/* Personal Details */}
                    <div>
                      <h3 className="mb-5 text-sm font-semibold text-text-primary">
                        Personal Details
                      </h3>

                      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">

                        {/* First Name */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-text-primary">
                            First Name <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <User
                              className="absolute left-3.5 top-3.5 text-text-secondary/60"
                              size={17}
                            />

                            <input
                              name="first_name"
                              placeholder="Enter first name"
                              value={values.first_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={inputClass}
                            />
                          </div>

                          <FieldError name="first_name" />
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-text-primary">
                            Last Name <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <User
                              className="absolute left-3.5 top-3.5 text-text-secondary/60"
                              size={17}
                            />

                            <input
                              name="last_name"
                              placeholder="Enter last name"
                              value={values.last_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={inputClass}
                            />
                          </div>

                          <FieldError name="last_name" />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-text-primary">
                            Email Address <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <Mail
                              className="absolute left-3.5 top-3.5 text-text-secondary/60"
                              size={17}
                            />

                            <input
                              type="email"
                              name="email"
                              placeholder="example@gmail.com"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={inputClass}
                            />
                          </div>

                          <FieldError name="email" />
                        </div>

                        {/* Contact Number */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-text-primary">
                            Contact Number <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <Phone
                              className="absolute left-3.5 top-3.5 text-text-secondary/60"
                              size={17}
                            />

                            <input
                              type="tel"
                              name="contact_No"
                              placeholder="10-digit mobile number"
                              value={values.contact_No}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              maxLength={10}
                              className={inputClass}
                            />
                          </div>

                          <FieldError name="contact_No" />
                        </div>

                        {/* Password */}
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-text-primary">
                            Password <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <Lock
                              className="absolute left-3.5 top-3.5 text-text-secondary/60"
                              size={17}
                            />

                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Create a strong password"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`${inputClass} pr-12`}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword(!showPassword)
                              }
                              className="absolute right-3.5 top-3.5 text-text-secondary transition-colors hover:text-text-primary"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>

                          <FieldError name="password" />

                          <p className="text-xs text-text-secondary">
                            Minimum 8 characters and at least one special character.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Server Messages */}
                    {serverError && (
                      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {serverError}
                      </div>
                    )}

                    {successMessage && (
                      <div className="rounded-lg bg-success/10 p-3 text-sm text-success">
                        {successMessage}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col-reverse justify-end gap-3 border-t border-border/60 bg-background px-6 py-5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setPreview(null);
                        setShowPassword(false);
                        setServerError("");
                        setSuccessMessage("");
                      }}
                      className="rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-text-secondary transition hover:bg-background"
                    >
                      Reset Form
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting
                        ? "Registering User..."
                        : "Create User"}
                    </button>
                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default CreateUser;
