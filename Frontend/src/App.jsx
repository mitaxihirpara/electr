
import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/home";
import Login from "./pages/login";
import Orders from "./pages/Orders/Orders";
import Contact from "./pages/Contact/Contact";
import Cart from "./components/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import MobileCatalog from "./pages/mobilecatelog";
import TvCatalog from "./pages/tvcatelog/tvcatelog";


import AdminLogin from "./admin/Adminlogin";
import AdminDashboard from "./admin/Dashboard";
import AdminProducts from "./admin/AdminProducts";

const App = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();

  // Hide header/footer on admin pages
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}

      <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/mobiles" element={<MobileCatalog />} />
        <Route path="/tvs" element={<TvCatalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        
        {/* <Route path="/products/:category" element={<ProductCategory />} /> */}

        {/* ADMIN LOGIN */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ADMIN PROTECTED ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />

        <Route
          path="/admin/products"
          element={
            role === "admin" ? (
              <AdminProducts />
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
