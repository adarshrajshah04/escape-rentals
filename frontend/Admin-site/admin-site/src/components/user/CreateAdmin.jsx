
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axiosNew from "../../utils/axiosNew";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ImagePlus,
  ShieldCheck,
  X,
} from "lucide-react";

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
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "At least one special character required"),

  profile_image: Yup.mixed()
    .required("Profile image is required")
    .test("fileType", "Only JPG, PNG and WEBP allowed", (value) => {
      if (!value) return false;
      return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
    })
    .test("fileSize", "Image must be less than 2MB", (value) => {
      if (!value) return false;
      return value.size <= 2 * 1024 * 1024;
    }),
});

const CreateAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAdminSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setServerError("");
      setSuccessMessage("");

      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axiosNew.post(
        "/users/admin/create/",
        formData
      );

      setSuccessMessage(
        response.data?.message || "Admin created successfully!"
      );

      resetForm();
      setPreview(null);
    } catch (error) {
      setServerError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Unable to create admin. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-7 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <UserPlus size={27} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Admin
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a new administrator account for your dashboard.
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
          onSubmit={handleAdminSubmit}
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
          }) => {

            const FieldError = ({ name }) => (
              <p className="mt-1.5 min-h-5 text-xs text-red-500">
                {touched[name] && errors[name] ? errors[name] : ""}
              </p>
            );

            return (
              <form onSubmit={handleSubmit}>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                  {/* Form Heading */}
                  <div className="border-b border-gray-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-green-700" size={21} />
                      <div>
                        <h2 className="font-semibold text-gray-800">
                          Administrator Information
                        </h2>
                        <p className="text-xs text-gray-500">
                          Enter the details to register a new administrator.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-7 p-6 md:p-8">

                    {/* Profile Image */}
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-gray-700">
                        Profile Picture
                      </label>

                      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">

                        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">

                          {preview ? (
                            <img
                              src={preview}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User size={35} className="text-gray-400" />
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
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                            <ImagePlus size={17} />
                            Upload Image

                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.currentTarget.files?.[0];

                                if (file) {
                                  setFieldValue("profile_image", file);
                                  setPreview(URL.createObjectURL(file));
                                }
                              }}
                            />
                          </label>

                          <p className="mt-2 text-xs text-gray-400">
                            JPG, PNG or WEBP. Maximum size 2MB.
                          </p>

                          <FieldError name="profile_image" />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Personal Details */}
                    <div>
                      <h3 className="mb-5 text-sm font-semibold text-gray-800">
                        Personal Details
                      </h3>

                      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">

                        {/* First Name */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            First Name <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <User className="absolute left-3.5 top-3.5 text-gray-400" size={17} />

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
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <User className="absolute left-3.5 top-3.5 text-gray-400" size={17} />

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
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={17} />

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

                        {/* Contact */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Contact Number <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <Phone className="absolute left-3.5 top-3.5 text-gray-400" size={17} />

                            <input
                              type="tel"
                              name="contact_No"
                              placeholder="10-digit mobile number"
                              value={values.contact_No}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={inputClass}
                            />
                          </div>

                          <FieldError name="contact_No" />
                        </div>

                        {/* Password */}
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password <span className="text-red-500">*</span>
                          </label>

                          <div className="relative">
                            <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={17} />

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
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>

                          <FieldError name="password" />

                          <p className="text-xs text-gray-400">
                            Minimum 8 characters and at least one special character.
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Messages */}
                    {serverError && (
                      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {serverError}
                      </div>
                    )}

                    {successMessage && (
                      <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        {successMessage}
                      </div>
                    )}

                  </div>

                  {/* Footer */}
                  <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-5 sm:flex-row">

                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setShowPassword(false);
                        setServerError("");
                        setSuccessMessage("");
                        setFieldValue("profile_image", null);
                        document.activeElement?.blur();
                      }}
                      className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                    >
                      Clear Image
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-green-700 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Creating Admin..." : "Create Admin"}
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

export default CreateAdmin;
