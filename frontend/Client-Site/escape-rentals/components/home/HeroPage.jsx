import Image from "next/image";
import Link from "next/link";
import heroImage from "../../public/assets/images/heroImage.jpg";
import FeaturedHomes from "./FeaturedHomes";
import TrendingDestinations from "./TrendingDestinations";
import FeaturedPropertyHero from "./FeaturedPropertyHero";
import CategoryShowcase from "./CategoryShowcase";
import ReviewSection from "./ReviewSection";
import BlogSection from "./BlogSection";

const HeroPage = () => {
  return (
    <div>
    {/*hero section  */}
      <section className="relative min-h-[min(760px,calc(100svh-72px))] w-full overflow-hidden">
        <Image
          alt="Beautiful property for EscapeRentals"
          src={heroImage}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/45" />

        {/* Hero content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
          <span className="mb-6 rounded-full border border-white/30 bg-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
            A stay worth slowing down for
          </span>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-7xl">
            Find Your Perfect Escape
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
            Discover beautiful stays and unforgettable experiences.
          </p>
          <Link
            href="/properties"
            className="mt-8 inline-flex items-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-primary-dark"
          >
            Explore stays
          </Link>
        </div>
      </section>
      {/* Featured Homes */}
      <FeaturedHomes />

      {/* TrendingDestinations */}
      <TrendingDestinations/>
      {/* FeaturedPropertyHero  for redirecting to propertylist page */}
      <FeaturedPropertyHero/>

      {/* CategoryShowcase */}
      <CategoryShowcase/>

      {/* reviews */}
      <ReviewSection/>

      {/* BlogSection */}
      <BlogSection/>
    </div>
  );
};

export default HeroPage;
