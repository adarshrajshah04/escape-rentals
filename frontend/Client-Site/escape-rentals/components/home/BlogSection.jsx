
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const blogs = [
  {
    id: 1,
    title: "Top 10 Places to Visit in India",
    category: "Travel Guide",
    description:
      "Explore India's most beautiful destinations and discover amazing places for your next vacation.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    author: "Adarsh",
    date: "November 07, 2026",
    slug: "top-10-places-to-visit-in-india",
  },
  {
    id: 2,
    title: "How to Choose the Perfect Holiday Villa",
    category: "Rental Tips",
    description:
      "Find the perfect holiday villa by considering location, amenities, comfort and your budget.",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    author: "Adarsh",
    date: "November 05, 2026",
    slug: "choose-perfect-holiday-villa",
  },
  {
    id: 3,
    title: "Why Choose a Private Vacation Rental?",
    category: "Vacation Tips",
    description:
      "Discover the benefits of private vacation rentals and enjoy more privacy, comfort and flexibility.",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    author: "Adarsh",
    date: "November 03, 2026",
    slug: "benefits-of-private-vacation-rental",
  },
];

const BlogSection = () => {
  return (
    <section className="bg-background px-4 py-16 sm:px-8 lg:px-16">

      {/* Heading */}
      <div className="mx-auto mb-12 max-w-6xl">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          From Our Blog
        </h2>

        <p className="mt-3 text-sm text-text-secondary sm:text-base">
          Keep always updated on latest topics
        </p>
      </div>

      {/* Blog Cards */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >

            {/* Image */}
            <div className="relative h-56 w-full">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6">

              <h3 className="truncate text-lg font-semibold text-text-primary">
                {blog.title}
              </h3>

              <p className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {blog.category}
              </p>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-text-secondary">
                {blog.description}
              </p>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-text-secondary">

                <span>{blog.date}</span>

                <span>
                  By <span className="font-medium text-primary">{blog.author}</span>
                </span>

              </div>
{/* 
              <Link
                href={`/blog/${blog.slug}`}
                className="mt-5 inline-block text-sm font-semibold text-[#526F5E] hover:text-[#263D33]"
              >
                Read More →
              </Link> */}

            </div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default BlogSection;
