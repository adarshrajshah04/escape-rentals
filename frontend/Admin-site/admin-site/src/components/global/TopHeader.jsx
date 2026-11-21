import React, { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import axiosNew from "../../utils/axiosNew";
import { useNavigate } from "react-router-dom";

const TopHeader = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);

      const response = await axiosNew.get("/notifications/");

      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(
        "Notification error:",
        error.response?.data || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch again when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  // Format UTC Date into Indian Time
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    // Check whether timezone is provided
    const hasTimezone = /Z$|[+-]\d{2}:\d{2}$/.test(date);

    // Assume UTC if timezone is missing
    const utcDate = new Date(hasTimezone ? date : `${date}Z`);

    if (isNaN(utcDate.getTime())) {
      return "Invalid Date";
    }

    return utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }

  return (
    <div className="admin-topbar">
      <div className="admin-header-start">
        <button
          className="sidebar-collapse-button"
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {collapsed ? (
              <>
                <path d="M9 5l7 7-7 7" />
                <path d="M4 5v14" />
              </>
            ) : (
              <>
                <path d="M15 5l-7 7 7 7" />
                <path d="M20 5v14" />
              </>
            )}
          </svg>
        </button>
        <div className="admin-header-context">
          <strong>Escape Rentals</strong>
          <span>Property management workspace</span>
        </div>
      </div>

      <div className="admin-header-actions">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="admin-header-icon-button"
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <FaRegBell size={15} />

            {notifications.length > 0 && (
              <span className="notification-count">
                {notifications.length > 99 ? "99+" : notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-panel" aria-label="Notifications">
              <div className="notification-panel-heading">
                <span>Notifications</span>

                <span className="notification-panel-count">
                  {notifications.length} total
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <p className="p-6 text-center text-gray-500 text-sm">
                    Loading notifications...
                  </p>
                ) : notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div key={item.id} className="notification-item">
                      <div>
                        <p className="notification-item-title">
                          {item.action} {item.entity} by {item.username}
                        </p>
                      </div>

                      <p className="notification-item-description">
                        {item.description}
                      </p>

                      <p className="notification-item-date">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="p-6 text-center text-gray-500 text-sm">
                    No notifications available
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          className="admin-logout-button"
          onClick={logout}
        >
          <LuLogOut size={15} aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default TopHeader;
