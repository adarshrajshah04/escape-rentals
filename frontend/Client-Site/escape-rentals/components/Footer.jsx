import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#302824] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <Link
              href="/"
              aria-label="EscapeRentals home"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-white">
                E
              </span>
              <span className="text-xl font-semibold tracking-tight">
                EscapeRentals
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
              Discover thoughtful stays, explore somewhere new, and make your
              next getaway one to remember.
            </p>
            <Link
              href="/properties"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#edc5a9] transition-colors hover:text-white"
            >
              Find your next escape <span aria-hidden="true">→</span>
            </Link>
          </div>

          <nav aria-label="Explore">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Explore
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>
                <Link className="transition-colors hover:text-white" href="/properties">
                  All stays
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white" href="/destinations">
                  Destinations
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white" href="/categories">
                  Categories
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Company
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>
                <Link className="transition-colors hover:text-white" href="/about">
                  About us
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white" href="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white" href="/login">
                  Sign in
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Need help?
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/70">
              Our team is happy to help you find the right stay for your next
              trip.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Contact our team
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EscapeRentals. All rights reserved.</p>
          <Link href="/" className="transition-colors hover:text-white">
            Find your perfect escape
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
