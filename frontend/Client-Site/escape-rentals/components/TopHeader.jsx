"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import axiosNew from "@/utils/axiosNew";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Properties List", path: "/properties" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const TopHeader = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setProfile(null);
        setAuthChecked(true);
        return;
      }

      try {
        const response = await axiosNew.get("/users/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data.data );
      } catch (error) {
        
        setProfile(null);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();

    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, [pathname]);

  // Profile image URL
  const profileImage = profile?.profile_image
    ? profile.profile_image.startsWith("http")
      ? profile.profile_image
      : new URL(
          profile.profile_image.replace(/^\/+/, ""),
          axiosNew.defaults.baseURL
        ).href
    : "/default-profile.png";

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setProfile(null);
    setProfileOpen(false);
    setMenuOpen(false);

    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  // Profile dropdown links
  const profileLinks = [
    { name: "My Profile", path: "/my-profile" },
    { name: "My Bookings", path: "/my-bookings" },
    { name: "wishlist", path: "/wishlist" },
  ];

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-[999] w-full border-b border-border/70 bg-background/50 text-text-primary shadow-sm backdrop-blur-xl">

      {/* Main Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 sm:px-8 lg:px-0">

        {/* Logo */}
        <Link
          href="/"
          aria-label="EscapeRentals home"
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <span aria-hidden="true" className="text-2xl font-bold text-white">
              E
            </span>
          </div>
          <span className="text-xl font-semibold tracking-tight">
            EscapeRentals
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navItems.map((nav) => {
            const isActive =
              pathname === nav.path ||
              (nav.path !== "/" && pathname.startsWith(`${nav.path}/`));

            return (
              <Link
                key={nav.name}
                href={nav.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-text-secondary"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {nav.name}
              </Link>
            );
          })}
        </nav>

        {/* Login / Profile */}
        <div className="hidden md:block">
          {authChecked && (
            profile ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  className="rounded-full"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-14 w-60 rounded-2xl border border-border/70 bg-white py-2 text-text-primary shadow-xl">
                    <div className="border-b border-border/60 px-4 py-3">
                      <p className="font-semibold">
                        {profile.first_name} {profile.last_name}
                      </p>
                      <p className="truncate text-xs text-text-secondary">
                        {profile.email}
                      </p>
                    </div>

                    {profileLinks.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={closeMenu}
                        className="block px-4 py-3 text-sm transition-colors hover:bg-background"
                      >
                        {item.name}
                      </Link>
                    ))}

                    <button
                      onClick={handleLogout}
                      className="w-full border-t border-border/60 px-4 py-3 text-left text-sm text-danger transition-colors hover:bg-danger/5"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
              >
                Login
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-2xl transition-colors hover:bg-surface md:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-border/60 bg-background transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-4 py-3">
          {navItems.map((nav) => (
            <Link
              key={nav.name}
              href={nav.path}
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-primary"
              aria-current={pathname === nav.path ? "page" : undefined}
            >
              {nav.name}
            </Link>
          ))}

          {authChecked && (
            profile ? (
              <>
                <div className="flex items-center gap-3 border-t border-border/60 px-4 py-3">
                  <img
                    src={profileImage}
                    alt=""
                    className="h-11 w-11 rounded-full border-2 border-accent object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {profile.first_name} {profile.last_name}
                    </p>
                    <p className="truncate text-xs text-text-secondary">
                      {profile.email}
                    </p>
                  </div>
                </div>

                {profileLinks.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeMenu}
                    className="rounded-lg px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="px-4 py-3 text-left text-sm text-danger"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Login
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default TopHeader;