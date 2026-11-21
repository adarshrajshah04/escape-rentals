
"use client";

import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaClock,
} from "react-icons/fa";
import ContactForm from "./ContactForm"

const ContactMain = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend demo only. Connect your backend API here.
    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="bg-background">

      {/* Hero Section */}
      <section className="relative h-[350px] md:h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=90"
          alt="Beautiful modern interior"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative z-10 text-center px-5">
          <p className="text-accent uppercase tracking-[4px] text-sm mb-4">
            We are here to help
          </p>

          <h1 className="text-white text-4xl md:text-6xl font-semibold mb-5">
            Contact Us
          </h1>

          <p className="text-white/85 max-w-2xl mx-auto text-base md:text-lg leading-7">
            Have a question or need assistance? We'd love to hear from you.
            Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <div className="flex items-center justify-center p-10">
        <ContactForm/>
      </div>

      {/* Bottom Banner */}
      <section className="bg-surface py-14 px-5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">
            Your Next Adventure Starts Here
          </h2>

          <p className="text-text-secondary leading-7 max-w-2xl mx-auto">
            Discover beautiful properties, explore new destinations,
            and find the perfect place for your next getaway with
            EscapeRentals.
          </p>
        </div>
      </section>

    </main>
  );
};

export default ContactMain;
