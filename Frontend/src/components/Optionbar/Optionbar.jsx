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
          <NavLink to="/mobiles" className="option-item">
            <FontAwesomeIcon icon={faMobileScreen} />
            <span>Mobiles</span>
          </NavLink>
        </li>
        
       <li>
          {/* // className="laptop-menu-item"
          // onMouseEnter={() => setShowLaptopCatalog(true)}
          // onMouseLeave={() => setShowLaptopCatalog(false)}
         */}
          <Link to="/laptops" className="option-item">
            <FontAwesomeIcon icon={faLaptop} />
            <span>Laptops</span>
          </Link>
          
        </li>
        <li>
          <NavLink to="/tvs" className="option-item">
            <FontAwesomeIcon icon={faTv} />
            <span>Televisions</span>
          </NavLink>
        </li>
        
        <li>
          <Link to="/washing-machine" className="option-item">
            <FontAwesomeIcon icon={faSoap} />
            <span>Washing Machine</span>
          </Link>
        </li>

        <li>
          <Link to="/earbuds" className="option-item">
            <FontAwesomeIcon icon={faHeadphones} />
            <span>Earbuds</span>
          </Link>
        </li>

        <li>
          <Link to="/tablet" className="option-item">
            <FontAwesomeIcon icon={faTabletScreenButton} />
            <span>Tablet</span>
          </Link>
        </li>

        <li>
          <Link to="/air-conditioner" className="option-item">
            <FontAwesomeIcon icon={faWind} />
            <span>Air Conditioner</span>
          </Link>
        </li>
         <li>
          <Link to="/small-appliances" className="option-item">
            <FontAwesomeIcon icon={faBlender} />
            <span>Small Appliances</span>
          </Link>
        </li>
        <li>
          <Link to="/camera" className="option-item">
            <FontAwesomeIcon icon={faCamera} />
            <span>Camera</span>
          </Link>
        </li>
        <li>
          <Link to="/refrigerator" className="option-item">
            <FontAwesomeIcon icon={faSnowflake} />
            <span>Refrigerator</span>
          </Link>
        </li>
        <li>
          <Link to="/computer" className="option-item">
            <FontAwesomeIcon icon={faDesktop} />
            <span>Computer</span>
          </Link>
        </li>
        <li>
          <Link to="/smart-watch" className="option-item">
            <FontAwesomeIcon icon={faClock} />
            <span>Smart Watch</span>
          </Link>
        </li>
        <li>
          <Link to="/speakers" className="option-item">
            <FontAwesomeIcon icon={faVolumeHigh} />
            <span>Speakers</span>
          </Link>
        </li>
        <li>
          <Link to="/gaming-console" className="option-item">
            <FontAwesomeIcon icon={faGamepad} />
            <span>Gaming Console</span>
          </Link>
        </li>
 
      </ul>
    </div>
  );
};

export default OptionBar;
