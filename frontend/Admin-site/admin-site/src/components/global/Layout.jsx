import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebarr from "./Sidebarr";
import TopHeader from "./TopHeader";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-shell ">
      <header>
        <TopHeader collapsed={collapsed} setCollapsed={setCollapsed} />
      </header>
      <div className="admin-shell-body ">
        <Sidebarr collapsed={collapsed} />
        <main className="admin-content " >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;