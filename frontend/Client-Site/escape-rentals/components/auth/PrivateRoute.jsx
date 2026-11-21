"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PrivateRoute = ({ children }) => {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsAuthenticated(true);
    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm font-medium text-primary">
          Checking authentication...
        </p>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;