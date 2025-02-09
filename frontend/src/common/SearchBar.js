import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DarkModeContext } from "./DarkModeContext";

const SearchBar = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    const params = new URLSearchParams(location.search);
    if (searchTerm.trim()) {
      params.set("query", searchTerm);
    } else {
      params.delete("query");
    }
    navigate(`/products?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex ml-10 items-center w-full">
      <input
        type="text"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`sm:w-2/3 sm:px-2 sm:py-1 w-full px-4 py-2 rounded-md focus:outline-none transition-all duration-300 focus:ring-2 ${
          darkMode
            ? "text-white bg-gray-800 focus:ring-gray-500"
            : "text-black bg-white focus:ring-[#eab16d]"
        }`}
      />
      <button
        onClick={handleSearch}
        className={`ml-2 px-2 py-1 rounded-md hover:scale-105 transition-transform duration-300 sm:px-1 sm:py-0.5 ${
          darkMode
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-[#8B6538] text-white hover:bg-[#bf8657]"
        }`}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;