import Image from "next/image";
import Link from "next/link";
import React from "react";

import aboutImage from "../../public/assets/images/aboutImage.jpg";
import OurValues from "./OurValues";


const AboutMain = () => {
  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-[95vh] w-full items-center overflow-hidden">
        {/* Background Image */}
        <Image
          alt="Beautiful vacation destination"
          src={aboutImage}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 sm:px-10">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
              Welcome to EscapeRentals
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl">
              Discover Places.
              <span className="block text-[#E5B99D]">Create Memories.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
              We believe every journey deserves a special place. Discover
              beautiful stays, explore new destinations, and make every moment
              unforgettable with EscapeRentals.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/properties"
                className="rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-primary-dark"
              >
                Explore Properties
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-white/70 px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-white hover:text-text-primary"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
      </section>

      {/* About Intro Section */}

      {/* Our Story Section */}
      <section className="bg-[#F5F7F8] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-7">
            Our Story
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-text-secondary leading-8 text-base">
              EscapeRentals was created with a simple vision — to make finding
              the perfect stay easy, comfortable, and memorable. We believe
              every journey deserves a special place to stay, whether you are
              planning a peaceful getaway, a family vacation, or a weekend
              adventure.
            </p>

            <p className="text-text-secondary leading-8 text-base">
              Our platform brings together unique properties and comfortable
              stays in one place. From cozy cabins to luxurious homes, we help
              travelers discover spaces that feel like home. At EscapeRentals,
              we make every stay a part of your journey and every trip a
              beautiful memory.
            </p>
          </div>
        </div>
      </section>


      <OurValues/>

    </main>
  );
};

export default AboutMain;
