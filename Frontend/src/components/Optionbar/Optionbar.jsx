import React, { useState } from "react";
import { NavLink , Link} from "react-router-dom";
import "./Optionbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileScreen, faLaptop,faTv,faSnowflake,
  faSoap,
  faHeadphones,
  faTabletScreenButton,
  faWind, faBlender,faCamera ,faDesktop,
  faClock,
  faVolumeHigh,
  faGamepad } from "@fortawesome/free-solid-svg-icons";

//

const OptionBar = () => {
 // const [showLaptopCatalog, setShowLaptopCatalog] = useState(false);

  return (
    <div className="option-bar">
      <ul className="option-list">
       
         <li>
          <NavLink to="/tvs" className="option-item">
            <FontAwesomeIcon icon={faTv} />
            <span>Televisions</span>
          </NavLink>
        </li>
        
        
        <li>
          <NavLink to="/earbuds" className="option-item">
            <FontAwesomeIcon icon={faHeadphones} />
            <span>Earbuds</span>
          </NavLink>
        </li>
        <li>
          <Link to="/computers" className="option-item">
            <FontAwesomeIcon icon={faDesktop} />
            <span>Computer</span>
          </Link>
        </li>
        <li>
          <NavLink to="/mobiles" className="option-item">
            <FontAwesomeIcon icon={faMobileScreen} />
            <span>Mobiles</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/laptops" className="option-item">
            <FontAwesomeIcon icon={faLaptop} />
            <span>Laptops</span>
          </NavLink>
          
        </li>
         <li>
          <Link to="/small-appliances" className="option-item">
            <FontAwesomeIcon icon={faBlender} />
            <span>Small Appliances</span>
          </Link>
        </li>
        
      <li>
          <NavLink to="/smartwatches" className="option-item">
            <FontAwesomeIcon icon={faClock} />
            <span>Smart Watch</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tablets" className="option-item">
            <FontAwesomeIcon icon={faTabletScreenButton} />
            <span>Tablet</span>
          </NavLink>
        </li>
        <li>
          <Link to="/cameras" className="option-item">
            <FontAwesomeIcon icon={faCamera} />
            <span>Camera</span>
          </Link>
        </li>
        <li>
          <Link to="/speakers" className="option-item">
            <FontAwesomeIcon icon={faVolumeHigh} />
            <span>Speakers</span>
          </Link>
        </li>
      
        <li>
          <Link to="/airconditioners" className="option-item">
            <FontAwesomeIcon icon={faWind} />
            <span>Air Conditioner</span>
          </Link>
        </li>
        
        
        <li>
          <NavLink to="/washingmachines" className="option-item">
            <FontAwesomeIcon icon={faSoap} />
            <span>Washing Machine</span>
          </NavLink>
        </li>
        <li>
          <Link to="/refrigerators" className="option-item">
            <FontAwesomeIcon icon={faSnowflake} />
            <span>Refrigerator</span>
          </Link>
        </li>
        
        
        
        <li>
          <Link to="/gaming-consoles" className="option-item">
            <FontAwesomeIcon icon={faGamepad} />
            <span>Gaming Consoles</span>
          </Link>
        </li>
 
      </ul>
    </div>
  );
};

export default OptionBar;
