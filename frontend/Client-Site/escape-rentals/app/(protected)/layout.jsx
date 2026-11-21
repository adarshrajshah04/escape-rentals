import React from "react";
import PrivateRoute from "@/components/auth/PrivateRoute";

const ProtectedLayout = ({ children }) => {
  return (
    <PrivateRoute>
      {children}
    </PrivateRoute>
  );
};

export default ProtectedLayout;