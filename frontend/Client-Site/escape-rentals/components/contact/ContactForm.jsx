
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { FaPaperPlane } from "react-icons/fa";
import axiosNew from "@/utils/axiosNew";

const contactValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  subject: Yup.string()
    .trim()
    .required("Subject is required")
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject cannot exceed 100 characters"),

  message: Yup.string()
    .trim()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
});

const ContactForm = () => {
  return (
    <div className="w-full lg:w-[60%] bg-white p-6 md:p-10 rounded-2xl border border-border shadow-sm">

      {/* Form Heading */}
      <div className="mb-8">
        <span className="text-primary font-semibold text-sm uppercase tracking-[3px]">
          Get In Touch
        </span>

        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mt-3">
          Send Us a Message
        </h2>

        <p className="text-text-secondary mt-2 text-sm leading-6">
          Have a question or need assistance? Fill out the form below
          and our team will get back to you.
        </p>
      </div>

      <Formik
        initialValues={{
          name: "",
          email: "",
          subject: "",
          message: "",
        }}
        validationSchema={contactValidationSchema}
        onSubmit={(values, { setSubmitting ,resetForm}) => {
          axiosNew.post("/contact",values)
          .then((res)=>{
            resetForm()
            alert("message sended ")
          })

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
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Full Name <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                className={`w-full px-4 py-3.5 rounded-lg border bg-background outline-none transition-all duration-300
                  ${
                    touched.name && errors.name
                      ? "border-danger focus:ring-1 focus:ring-danger"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
                  }`}
              />

              {touched.name && errors.name && (
                <p className="text-danger text-xs mt-2">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email Address <span className="text-danger">*</span>
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className={`w-full px-4 py-3.5 rounded-lg border bg-background outline-none transition-all duration-300
                  ${
                    touched.email && errors.email
                      ? "border-danger focus:ring-1 focus:ring-danger"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
                  }`}
              />

              {touched.email && errors.email && (
                <p className="text-danger text-xs mt-2">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Subject <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                name="subject"
                placeholder="What is this regarding?"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.subject}
                className={`w-full px-4 py-3.5 rounded-lg border bg-background outline-none transition-all duration-300
                  ${
                    touched.subject && errors.subject
                      ? "border-danger focus:ring-1 focus:ring-danger"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
                  }`}
              />

              {touched.subject && errors.subject && (
                <p className="text-danger text-xs mt-2">
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Your Message <span className="text-danger">*</span>
              </label>

              <textarea
                name="message"
                placeholder="Write your message here..."
                rows={3}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
                className={`w-full px-4 py-3.5 rounded-lg border bg-background outline-none resize-none transition-all duration-300
                  ${
                    touched.message && errors.message
                      ? "border-danger focus:ring-1 focus:ring-danger"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
                  }`}
              />

              {touched.message && errors.message && (
                <p className="text-danger text-xs mt-2">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Send Message"}
              <FaPaperPlane className="text-sm" />
            </button>

          </form>
        )}
      </Formik>
    </div>
  );
};

export default ContactForm;
