import React from "react";

import {  Route, Routes, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/home";
import Login from "./pages/login";
import Orders from "./pages/Orders/Orders";
import Contact from "./pages/Contact/Contact";
import Cart from "./components/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import Terms from "./pages/Terms/Terms";
import Privacy from "./pages/Privacy/Privacy";
import CancellationReturns from "./pages/Cancellation/cancellation";
import ProductDetails from "./pages/Productdetails/Productdetails";
import ForgotPassword from "./pages/ForgetPassword";
import ProductDetail from "./pages/Productdetails/Productdetails";
import BrandProducts from "./pages/BrandProducts";
import Checkout from "./pages/checkout";
import OrderDetails from "./pages/OrderDetails";
import OrderTracking from "./components/OrderTracking";



import MobileCatalog from "./pages/mobilecatelog";
import TvCatalog from "./pages/tvcatelog/tvcatelog";
import SmartWatchCatalog from "./pages/smartwatch/smartwatch";
import WashingMachineCatalog from "./pages/washingmachine/washingmachine";
import LaptopCatalog from "./pages/laptop/laptop";
import EarbudsCatalog from "./pages/earbuds/earbuds";
import TabletCatalog from "./pages/tablet/tablet";
import RefrigeratorCatalog from "./pages/Refrigerator/Refrigerator";
import ACCatelog from "./pages/ac/ac";
import CameraCatalog from "./pages/camera/camera";
import ComputerCatalog from "./pages/computer/computer";
import SpeakerCatalog from "./pages/speaker/speaker";
import GamingConsoleCatalog from "./pages/gamingconsole/gamingconsole";
import SmallApplianceCatalog from "./pages/smallappliance/smallappliance";





import AdminLogin from "./admin/Adminlogin";
import AdminDashboard from "./admin/Dashboard";
import AdminProducts from "./admin/AdminProducts";
import AddProduct from "./admin/AddProduct";
import AdminOrders from "./admin/AdminOrder";
import AdminLayout from "./admin/AdminLayout";
import Customers from "./admin/Customers";
import CustomerDetails from "./admin/Customerdetails";
import AdminOrderDetails from './admin/AdminOrderDetails';



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
        <Route path="/smartwatches" element={<SmartWatchCatalog />} />
        <Route path="/washingmachines" element={<WashingMachineCatalog />} />
        <Route path="/refrigerators" element={<RefrigeratorCatalog />} />

        <Route path="/laptops" element={<LaptopCatalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/earbuds" element={<EarbudsCatalog />} />
        <Route path="/tablets" element={<TabletCatalog />} />
        <Route path="/airconditioners" element={<ACCatelog />} />
        <Route path="/cameras" element={<CameraCatalog />} />
        <Route path="/computers" element={<ComputerCatalog />} />
        <Route path="/speakers" element={<SpeakerCatalog />} />
        <Route path="/gaming-consoles" element={<GamingConsoleCatalog />} />
        <Route path="/small-appliances" element={<SmallApplianceCatalog />} />



        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/orders" element={<Orders />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cancellation-returns" element={<CancellationReturns />} />
        <Route path="/brand/:brand" element={<BrandProducts />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders/:id" element={<OrderDetails />} />

        <Route path="/wishlist" element={<Wishlist />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        
  

        {/* ADMIN LOGIN */}
        <Route path="/admin-login" element={<AdminLogin />} />
      
         <Route
        path="/admin"
        element={role === "admin" ? <AdminLayout /> : <Navigate to="/admin-login" />

        }
         >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        <Route path="/admin/order/:orderId" element={<AdminOrderDetails />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    
    </>
    
  );
};

export default App;
