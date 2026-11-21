import React from 'react'

import { Sidebar, Menu, MenuItem,SubMenu  } from "react-pro-sidebar";
import { FaRegUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { BsTags } from "react-icons/bs";
import { CiViewTable } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { PiHouseLine } from "react-icons/pi";
import { LuCalendarCheck } from "react-icons/lu";
import { LuWallet } from "react-icons/lu";
import { LuMessageSquareText } from "react-icons/lu";
import { Link } from 'react-router-dom';




const NavIcon = ({ type }) => {
  const paths = {
    documentation: <><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v16H6.5A1.5 1.5 0 0 0 5 20.5z" /><path d="M5 16.5A1.5 1.5 0 0 1 6.5 15H19M9 7h6M9 10h6" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4M16.5 3v4M3.5 10h17M8 14h2M14 14h2M8 17h2" /></>,
    commerce: <><path d="M4 8h16l-1.2 12H5.2z" /><path d="M8 8a4 4 0 0 1 8 0M9 12v2M15 12v2" /></>,
    examples: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
};

const Sidebarr = ({collapsed}) => {
  

  return (
    <div className="sidebar-layout">
      <Sidebar
        collapsed={collapsed}
        className="admin-sidebar"
        aria-label="Main navigation"
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark" aria-hidden="true">E</div>
          {!collapsed && (
            <div className="sidebar-brand-copy">
              <span className="sidebar-brand-name">Escape Rentals</span>
              <span className="sidebar-brand-caption">ADMIN CONSOLE</span>
            </div>
          )}
        </div>

        {!collapsed && <p className="sidebar-section-label">MENU</p>}
        <Menu>
          <MenuItem icon={<NavIcon type="documentation" /> } title="Documentation"component={<Link to="/home"/>} >
            Dashboard
          </MenuItem>
          {/* user menu */}
          <SubMenu
          icon={<FaRegUser />}
          label="User">
           
              <MenuItem icon={<FaUsers />} title='User table' component={<Link to="all-users"/>}>
              User table
              </MenuItem>
              <MenuItem icon={<FaUsers />} title='User table' component={<Link to="all-admin"/>}>
              Admin table
              </MenuItem>
            
            <MenuItem icon={<RiAdminFill />} title='Add Admin'component={<Link to={"create-admin"}/>}>
            Add Admin
            </MenuItem>
          </SubMenu>
          {/* Category */}
          <SubMenu
          icon={<BsTags />}
          label="Category">
            
              <MenuItem icon={<CiViewTable />} title="All-category" component={<Link to="category"/>}>
              All-category
              </MenuItem>
            
            
            <MenuItem icon={<FaPlus />} title="Add-category" component={<Link to="/add-category"/>}>
            Add-category
            </MenuItem>
            
          </SubMenu>
          {/* Properties */}
          <SubMenu
          icon={<PiHouseLine />}
          label="Properties">
            <MenuItem icon={<CiViewTable />} title="All-Properties" component={<Link to="/properties"/>}>
            All-Properties
            </MenuItem>
            <MenuItem icon={<FaPlus />} title="Add-Properties" component={<Link to="/add-properties"/>}>
            Add-Properties
            </MenuItem>

          </SubMenu>
          {/* booking */}
          <MenuItem icon={<LuCalendarCheck />} title="Booking" component={<Link to="/booking"/>}>
            Booking
          </MenuItem>
          {/* Payment */}
          {/* <MenuItem icon={<LuWallet />} title="Payment">
            Payment
          </MenuItem> */}
          {/* Reviews */}
          <MenuItem icon={<LuMessageSquareText /> } title="Reviews" component={<Link to="/all-reviews"/>} >
            Reviews
          </MenuItem>
        </Menu>

        {/* <div className="sidebar-footer">
          <div className="sidebar-avatar" aria-hidden="true">A</div>
          {!collapsed && (
            <div className="sidebar-user-copy">
              <span className="sidebar-user-name">Administrator</span>
              <span className="sidebar-user-role">Workspace owner</span>
            </div>
          )}
        </div> */}
      </Sidebar>

      
    </div>
  );
};

export default Sidebarr;
