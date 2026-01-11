import React from "react";
import { Route, Routes } from "react-router-dom";
import "./index.css";

import Login from "./pages/login";
import Orders from "./pages/Orders/Orders";
import Header from "./components/Header/Header";
import OptionBar from "./components/Optionbar/Optionbar";
import Ads from "./components/Ads/Ads";
import Home from "./pages/home";
import Contact from "./pages/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Cart from "./components/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import ProductCategory from "./pages/Products/ProductCategory";




// app.jsx


const App = () => {
  return (
    <>
      {/* Common layout */}
      <Header />
      {/* Page routes */}
      <Routes>
         <Route path="/" element={<Home />} />
         

        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/products/:category" element={<ProductCategory />} />
        
      </Routes>
      <Footer />
    </>
  );
};

export default App;
