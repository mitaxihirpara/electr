

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Searchbar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // ✅ category → route map (OBJECT, not array)
  const categoryRouteMap = {
    tv: "/tvs",
    mobile: "/mobiles",
    laptop: "/laptops",
    smartwatch: "/smartwatches",
    washingmachine: "/washingmachines",
    refrigerator: "/refrigerators",
    ac: "/airconditioners",
    gamingconsole: "/gamingconsoles",
    smallappliance: "/smallappliances",
  };

  // 🔹 fetch suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    fetch(`http://localhost:5000/search-suggestions?q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.results || []);
        setShowDropdown(true);
      })
      .catch(console.error);
  }, [query]);

  // 🔹 click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 select item
  const handleSelect = (item) => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);

    if (item.type === "category") {
      navigate(categoryRouteMap[item.slug]);
    } else {
      navigate(`/product/${item.id}`);
    }
  };

  // 🔹 ENTER key handler
  const handleSearch = (e) => {
    e.preventDefault();

    const q = query.toLowerCase().trim();

    // 🔹 direct category enter
    if (categoryRouteMap[q]) {
      navigate(categoryRouteMap[q]);
      return;
    }

    // 🔹 single suggestion
    if (suggestions.length === 1) {
      handleSelect(suggestions[0]);
      return;
    }

    setShowDropdown(true);
  };

  return (
    <form className="searchbar-container" ref={dropdownRef} onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        autoComplete="off"
      />

      {showDropdown && suggestions.length > 0 && (
        <ul className="search-dropdown">
          {suggestions.map((item) => (
            <li
              key={`${item.type}-${item.id || item.slug}`}
              onClick={() => handleSelect(item)}
              className="search-item"
            >
              {item.name}
              
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
