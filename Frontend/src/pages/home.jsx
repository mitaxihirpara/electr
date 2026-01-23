import React from "react";
import { useState, useEffect } from "react";
import OptionBar from "../components/Optionbar/Optionbar";
import Ads from "../components/Ads/Ads";
import Brands from "../components/Brands/Brands";
import SpecialDeals from "../components/Specialdeals/Specialdeals";
import TrendingNow from "../components/Trendingnow/Trendingnow";
import ErrorBoundary from "../components/ErrorBoundary";

const Home = () => {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/trending")
      .then(res => res.json())
      .then(data => {
        console.log("Trending API:", data);

        // 🔐 SAFETY
        if (Array.isArray(data)) {
          setTrending(data);
        } else {
          setTrending([]);
        }
      })
      .catch(() => setTrending([]));
  }, []);

  return (
    <>
      <OptionBar />
      <Ads />
      <SpecialDeals />
      <Brands />
      <ErrorBoundary>
        <TrendingNow products={trending} />
      </ErrorBoundary>
    </>
  );
};
export default Home;

  



