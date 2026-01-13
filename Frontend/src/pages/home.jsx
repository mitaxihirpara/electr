import React from "react";
import OptionBar from "../components/Optionbar/Optionbar";
import Ads from "../components/Ads/Ads";
import Brands from "../components/Brands/Brands";
import SpecialDeals from "../components/Specialdeals/Specialdeals";

const Home = () => {
  return (
    <>
      
      <OptionBar />
      <Ads />
       <Brands />
        <SpecialDeals />
    </>
  );
};

export default Home;
