
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const destinations = [
  {
    id: 1,
    name: "Goa",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
  },
  {
    id: 2,
    name: "Manali",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23",
  },
  {
    id: 3,
    name: "Jaipur",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a",
  },
  {
    id: 4,
    name: "Kerala",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
  },
];

const TrendingDestinations = () => {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Explore Places
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Trending Destinations
          </h2>

          <p className="text-text-secondary mt-3">
            Explore our selection of the best places for your next getaway.
          </p>
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {destinations.map((destination) => (
            <Link
               href={`/destinations/${destination.name.toLowerCase()}`}
              key={destination.id}
              className="group relative h-[280px] md:h-[355px] rounded-xl overflow-hidden"
            >

              {/* Image */}
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Destination Name */}
              <div className="absolute inset-x-0 bottom-0 p-7 text-center">
                <h3 className="text-white text-xl md:text-2xl font-bold">
                  {destination.name}
                </h3>

                <p className="text-white/80 text-sm mt-1">
                  {destination.country}
                </p>
              </div>

            </Link>
          ))}

        </div>
      </div>
    </section>
  );
};

export default TrendingDestinations;
