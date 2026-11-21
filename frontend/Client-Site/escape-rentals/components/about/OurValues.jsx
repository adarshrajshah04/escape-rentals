
import React from "react";

const values = [
  {
    id: 1,
    title: "Quality",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900",
    description:
      "We focus on providing quality properties, comfortable spaces, and memorable experiences for every guest.",
  },
  {
    id: 2,
    title: "Teamwork",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900",
    description:
      "We work together with property owners and guests to create a smooth and enjoyable booking experience.",
  },
  {
    id: 3,
    title: "Respect",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900",
    description:
      "We value every guest and property owner by building relationships based on trust and respect.",
  },
  {
    id: 4,
    title: "Comfort",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900",
    description:
      "We believe every stay should feel relaxing, welcoming, and comfortable, just like home.",
  },
  {
    id: 5,
    title: "Trust",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900",
    description:
      "Transparency and reliability are at the heart of our platform, helping guests book with confidence.",
  },
  {
    id: 6,
    title: "Memorable Experiences",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900",
    description:
      "We help travelers discover beautiful places and create unforgettable memories with every journey.",
  },
];

const OurValues = () => {
  return (
    <section className="bg-[#F5F7F8] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-8">
          Our Values
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">

          {values.map((value) => (
            <div key={value.id} className="group">

              {/* Image */}
              <div className="w-full h-60 overflow-hidden rounded-sm">
                <img
                  src={value.image}
                  alt={value.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="pt-5">
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {value.title}
                </h3>

                <p className="text-text-secondary leading-7 text-base">
                  {value.description}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default OurValues;
