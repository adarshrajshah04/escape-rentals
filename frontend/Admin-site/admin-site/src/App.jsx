import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/global/Layout";
import Deashboard from "./components/Deashboard";
import LoginPage from "./components/LoginPage";
import { Private } from "./components/Private";
import ManiCatrgoryTable from "./components/category/ManiCatrgoryTable";
import AddCategory from "./components/category/AddCategory";
import UpdateCategory from "./components/category/UpdateCategory";
import MainPropertyTable from "./components/properties/MainPropertyTable";
import CreateProperties from "./components/properties/CreateProperties";
import UpdateProperties from "./components/properties/UpdateProperties";
import SingleProperty from "./components/properties/SingleProperty";
import ManiBookingTable from "./components/booking/MainBookingTable";
import MainUserTable from "./components/user/MainUserTable";
import MainAdminTable from "./components/user/MainAdminTable";
import CreateAdmin from "./components/user/CreateAdmin";
import ReviewMain from "./components/review/ReviewMain";



const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Private Routes */}
      <Route path="/" element={<Private />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Deashboard />} />
          <Route path="/home" element={<Deashboard />} />
          <Route path="/category" element={<ManiCatrgoryTable />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/properties" element={<MainPropertyTable />} />
          <Route path="/add-properties" element={<CreateProperties />} />
          <Route path="/booking" element={<ManiBookingTable/>} />
          <Route path="/all-users" element={<MainUserTable/>} />
          <Route path="/all-admin" element={<MainAdminTable/>} />
          <Route path="/create-admin" element={<CreateAdmin/>} />
          <Route path="/all-reviews" element={<ReviewMain/>} />

          {/* dynamic routes */}
          <Route path="/update-category/:id" element={<UpdateCategory />} />
          <Route path="/update-properties/:id" element={<UpdateProperties />} />
          <Route path="/single-properties/:propertyId" element={<SingleProperty />} />

          

        </Route>
      </Route>

      {/* Default Route */}
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
    </Routes>
  );
};

export default App;