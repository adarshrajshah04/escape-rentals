import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Users, House, CalendarCheck, Wallet, Tags, Star,
  ArrowUpRight, Clock3, CheckCircle2, XCircle, MessageSquareText,
  TrendingUp, RefreshCw
} from "lucide-react";

import { fetchUsers } from "../redux/action/user.action";
import { fetchProperties } from "../redux/action/properties.action";
import { fetchBooking } from "../redux/action/booking.action";
import { fetchCategory } from "../redux/action/category.action";
import { fetchReview } from "../redux/action/review.action";
import Loading from "./common/Loading";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "-";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? "-"
    : parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const getStatusClass = (status = "") => {
  const value = status.toLowerCase();
  if (value === "confirmed" || value === "active") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (value === "pending") return "bg-amber-50 text-amber-700";
  if (value === "cancelled" || value === "inactive") {
    return "bg-rose-50 text-rose-700";
  }
  return "bg-slate-100 text-slate-600";
};

const StatCard = ({ title, value, note, icon: Icon, tone }) => (
  <div className="rounded-2xl border border-[#E5EAE5] bg-white p-5 shadow-[0_4px_16px_rgba(55,80,65,0.04)]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-[#78877E]">{title}</p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-[#263D33]">
          {value}
        </p>
        <p className="mt-2 text-xs text-[#78877E]">{note}</p>
      </div>
      <div className={`rounded-xl p-3 ${tone}`}>
        <Icon size={21} />
      </div>
    </div>
  </div>
);

const SectionHeading = ({ title, subtitle, to, linkText = "View all" }) => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <div>
      <h2 className="text-base font-semibold text-[#263D33]">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-[#78877E]">{subtitle}</p>}
    </div>
    {to && (
      <Link
        to={to}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#526F5E] hover:text-[#263D33]"
      >
        {linkText} <ArrowUpRight size={15} />
      </Link>
    )}
  </div>
);

const EmptyState = ({ children }) => (
  <div className="rounded-xl border border-dashed border-[#DCE5DE] px-4 py-8 text-center text-sm text-[#78877E]">
    {children}
  </div>
);

export default function Deashboard() {
  const dispatch = useDispatch();

  const { users = [], isLoading: usersLoading, errorMsg: usersError } =
    useSelector((state) => state.users || {});
  const { properties = [], isLoading: propertiesLoading, errorMsg: propertiesError } =
    useSelector((state) => state.properties || {});
  const { booking = [], isLoading: bookingLoading, errorMsg: bookingError } =
    useSelector((state) => state.booking || {});
  const { category = [], isLoading: categoryLoading, errorMsg: categoryError } =
    useSelector((state) => state.category || {});
  const { reviews = [], isLoading: reviewsLoading, errorMsg: reviewsError } =
    useSelector((state) => state.reviews || {});

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProperties());
    dispatch(fetchBooking());
    dispatch(fetchCategory());
    dispatch(fetchReview());
  }, [dispatch]);

  const dashboard = useMemo(() => {
    const normalUsers = users.filter((user) => user.is_admin === false);
    const activeProperties = properties.filter((property) => property.is_active === true);
    const confirmedBookings = booking.filter(
      (item) => (item.status || "").toLowerCase() === "confirmed"
    );
    const pendingBookings = booking.filter(
      (item) => (item.status || "").toLowerCase() === "pending"
    );
    const cancelledBookings = booking.filter(
      (item) => (item.status || "").toLowerCase() === "cancelled"
    );
    const revenue = confirmedBookings.reduce(
      (total, item) => total + (Number(item.total_amount ?? item.total_price) || 0),
      0
    );
    const ratings = reviews
      .map((review) => Number(review.rating))
      .filter((rating) => Number.isFinite(rating) && rating > 0);
    const averageRating = ratings.length
      ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
      : 0;

    return {
      normalUsers,
      activeProperties,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      revenue,
      averageRating,
    };
  }, [users, properties, booking, reviews]);

  const monthlyRevenue = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      months.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleDateString("en-IN", { month: "short" }),
        value: 0,
      });
    }

    booking.forEach((item) => {
      if ((item.status || "").toLowerCase() !== "confirmed") return;
      const date = new Date(item.created_at || item.check_in);
      if (Number.isNaN(date.getTime())) return;
      const month = months.find(
        (entry) => entry.key === `${date.getFullYear()}-${date.getMonth()}`
      );
      if (month) month.value += Number(item.total_amount ?? item.total_price) || 0;
    });
    return months;
  }, [booking]);

  const maxRevenue = Math.max(...monthlyRevenue.map((month) => month.value), 1);
  const isLoading =
    usersLoading || propertiesLoading || bookingLoading || categoryLoading || reviewsLoading;
  const errors = [usersError, propertiesError, bookingError, categoryError, reviewsError].filter(Boolean);

  const recentBookings = [...booking]
    .sort((a, b) => new Date(b.created_at || b.check_in || 0) - new Date(a.created_at || a.check_in || 0))
    .slice(0, 5);
  const recentReviews = [...reviews]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 4);

  if (isLoading && !users.length && !properties.length && !booking.length && !category.length && !reviews.length) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loading text="Loading dashboard..." /></div>;
  }

  return (
    <div className="min-h-full space-y-7 bg-[#F7F8F5] pb-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789985]">
            Escape Rentals · Admin
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#263D33]">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-[#78877E]">
            Your property rental platform at a glance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            dispatch(fetchUsers());
            dispatch(fetchProperties());
            dispatch(fetchBooking());
            dispatch(fetchCategory());
            dispatch(fetchReview());
          }}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#DCE5DE] bg-white px-4 py-2.5 text-sm font-medium text-[#526F5E] transition hover:bg-[#F0F5F1]"
        >
          <RefreshCw size={15} /> Refresh data
        </button>
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Some dashboard data could not be loaded. Check the relevant API requests and refresh.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard title="Registered Users" value={dashboard.normalUsers.length} note="Customers on the platform" icon={Users} tone="bg-[#EAF1EC] text-[#526F5E]" />
        <StatCard title="Total Properties" value={properties.length} note={`${dashboard.activeProperties.length} active properties`} icon={House} tone="bg-[#EEF3F0] text-[#526F5E]" />
        <StatCard title="Categories" value={category.length} note="Property categories" icon={Tags} tone="bg-[#F5F0E6] text-[#A1844D]" />
        <StatCard title="Total Bookings" value={booking.length} note={`${dashboard.confirmedBookings.length} confirmed`} icon={CalendarCheck} tone="bg-[#EAF2F4] text-[#548293]" />
        <StatCard title="Confirmed Revenue" value={formatCurrency(dashboard.revenue)} note="From confirmed bookings" icon={Wallet} tone="bg-[#F1EDF7] text-[#8066A0]" />
        <StatCard title="Average Rating" value={`${dashboard.averageRating.toFixed(1)} / 5`} note={`${reviews.length} customer reviews`} icon={Star} tone="bg-[#FBF3E6] text-[#B18B43]" />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div className="rounded-2xl border border-[#E5EAE5] bg-white p-5 sm:p-6">
          <SectionHeading title="Revenue Overview" subtitle="Confirmed booking revenue · Last 6 months" />
          <div className="mt-6 flex h-52 items-end gap-3 sm:gap-5">
            {monthlyRevenue.map((month) => (
              <div key={month.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <span className="max-w-full truncate text-[10px] font-medium text-[#78877E] sm:text-xs">
                  {month.value ? formatCurrency(month.value) : "—"}
                </span>
                <div className="flex h-36 w-full items-end overflow-hidden rounded-t-lg bg-[#F0F4F1]">
                  <div
                    className="w-full rounded-t-lg bg-[#789985] transition-all"
                    style={{ height: `${month.value ? Math.max((month.value / maxRevenue) * 100, 5) : 3}%` }}
                    title={`${month.label}: ${formatCurrency(month.value)}`}
                  />
                </div>
                <span className="text-xs font-medium text-[#78877E]">{month.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#9AA69E]">
            Revenue is grouped by booking creation date when available, otherwise check-in date.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5EAE5] bg-white p-5 sm:p-6">
          <SectionHeading title="Booking Status" subtitle="Current booking distribution" to="/booking" />
          <div className="mt-6 space-y-5">
            {[
              { label: "Confirmed", count: dashboard.confirmedBookings.length, icon: CheckCircle2, color: "bg-emerald-500", text: "text-emerald-700" },
              { label: "Pending", count: dashboard.pendingBookings.length, icon: Clock3, color: "bg-amber-400", text: "text-amber-700" },
              { label: "Cancelled", count: dashboard.cancelledBookings.length, icon: XCircle, color: "bg-rose-400", text: "text-rose-700" },
            ].map((item) => {
              const percentage = booking.length ? (item.count / booking.length) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-2 text-sm font-medium ${item.text}`}>
                      <item.icon size={16} /> {item.label}
                    </span>
                    <span className="text-sm font-semibold text-[#263D33]">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F0F2EF]">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#F7F8F5] p-3">
              <p className="text-xs text-[#78877E]">Booking conversion</p>
              <p className="mt-1 text-lg font-semibold text-[#263D33]">
                {booking.length ? `${((dashboard.confirmedBookings.length / booking.length) * 100).toFixed(0)}%` : "0%"}
              </p>
            </div>
            <div className="rounded-xl bg-[#F7F8F5] p-3">
              <p className="text-xs text-[#78877E]">Cancelled</p>
              <p className="mt-1 text-lg font-semibold text-[#263D33]">{dashboard.cancelledBookings.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5EAE5] bg-white p-5 sm:p-6">
        <SectionHeading title="Recent Bookings" subtitle="Latest booking activity" to="/booking" />
        {recentBookings.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-[#EAEFEA] text-xs uppercase tracking-wide text-[#9AA69E]">
                  <th className="px-3 py-3 font-semibold">Booking</th>
                  <th className="px-3 py-3 font-semibold">Customer</th>
                  <th className="px-3 py-3 font-semibold">Property</th>
                  <th className="px-3 py-3 font-semibold">Check-in</th>
                  <th className="px-3 py-3 font-semibold">Amount</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((item) => (
                  <tr key={item.id} className="border-b border-[#F0F2EF] last:border-0">
                    <td className="px-3 py-4 text-sm font-semibold text-[#526F5E]">#{item.id}</td>
                    <td className="px-3 py-4">
                      <p className="text-sm font-medium text-[#263D33]">{item.user_name || `User #${item.user_id}`}</p>
                      <p className="mt-1 text-xs text-[#9AA69E]">{item.email || ""}</p>
                    </td>
                    <td className="max-w-[220px] px-3 py-4 text-sm text-[#526157]">
                      <span className="block truncate">{item.property_name || `Property #${item.property_id}`}</span>
                    </td>
                    <td className="px-3 py-4 text-sm text-[#78877E]">{formatDate(item.check_in)}</td>
                    <td className="px-3 py-4 text-sm font-semibold text-[#263D33]">
                      {formatCurrency(item.total_amount ?? item.total_price)}
                    </td>
                    <td className="px-3 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClass(item.status)}`}>
                        {item.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState>No bookings available yet.</EmptyState>}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-[#E5EAE5] bg-white p-5 sm:p-6">
          <SectionHeading title="Recent Reviews" subtitle="Latest customer feedback" to="/all-reviews" />
          {recentReviews.length ? (
            <div className="divide-y divide-[#F0F2EF]">
              {recentReviews.map((review) => (
                <div key={review.id} className="flex gap-3 py-4 first:pt-1 last:pb-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EAF1EC] text-sm font-semibold text-[#526F5E]">
                    {review.user_profile_picture ? (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/${review.user_profile_picture.replace(/^\/+/, "")}`}
                        alt={review.user_name || "User"}
                        className="h-full w-full object-cover"
                        onError={(event) => { event.currentTarget.style.display = "none"; }}
                      />
                    ) : (review.user_name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#263D33]">{review.user_name || `User #${review.user_id}`}</p>
                      <span className="text-xs text-[#9AA69E]">{formatDate(review.created_at)}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-[#78877E]">{review.property_name || `Property #${review.property_id}`}</p>
                    <div className="mt-1 flex items-center gap-1 text-[#C49B50]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={12} fill={index < Number(review.rating || 0) ? "currentColor" : "none"} />
                      ))}
                      <span className="ml-1 text-xs font-medium text-[#78877E]">{review.rating || 0}/5</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#526157]">{review.comment || "No comment provided."}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState>No customer reviews available yet.</EmptyState>}
        </div>

        <div className="rounded-2xl border border-[#E5EAE5] bg-white p-5 sm:p-6">
          <SectionHeading title="Platform Summary" subtitle="Quick links to manage your platform" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { label: "Manage Users", value: users.length, to: "/all-users", icon: Users },
              { label: "Manage Properties", value: properties.length, to: "/properties", icon: House },
              { label: "Manage Categories", value: category.length, to: "/category", icon: Tags },
              { label: "View Reviews", value: reviews.length, to: "/all-reviews", icon: MessageSquareText },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="group rounded-xl border border-[#E8EEE9] p-4 transition hover:border-[#B7CBBE] hover:bg-[#F7FAF7]"
              >
                <div className="flex items-center justify-between">
                  <item.icon size={19} className="text-[#789985]" />
                  <ArrowUpRight size={15} className="text-[#AAB6AD] transition group-hover:text-[#526F5E]" />
                </div>
                <p className="mt-4 text-xl font-semibold text-[#263D33]">{item.value}</p>
                <p className="mt-1 text-xs font-medium text-[#78877E]">{item.label}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-[#F7F8F5] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#526F5E]">
              <TrendingUp size={16} /> Property activity
            </div>
            <p className="mt-2 text-sm text-[#78877E]">
              {dashboard.activeProperties.length} of {properties.length} properties are currently marked active.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
