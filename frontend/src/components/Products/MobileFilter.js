import React, { useState, useEffect, useContext } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import { categoryIcons } from "./FilterProduct";
import { DarkModeContext } from "../../common/DarkModeContext";

const MobileFilter = ({ filters, sortOption, setSortOption, handleFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { darkMode } = useContext(DarkModeContext); // Access dark mode state

    const toggleFilter = () => setIsOpen(!isOpen);
    const closeFilter = () => setIsOpen(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") closeFilter();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="md:hidden">
            {/* Filter Toggle Button */}
            <button
                onClick={toggleFilter}
                className={`fixed top-20 right-5 z-10 ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-[#482f1a] hover:bg-[#895e3b]"
                    } text-white p-3 rounded-full shadow-lg transition-colors duration-200`}
            >
                <FaFilter size={24} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50"
                    onClick={closeFilter}
                ></div>
            )}

            {/* Filter Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 ${darkMode ? "bg-gray-800" : "bg-white"
                    } z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out shadow-lg overflow-y-auto ${darkMode
                        ? "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                        : "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                    }`}
            >
                <div className="p-5">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            Filters
                        </h2>
                        <button
                            onClick={closeFilter}
                            className={`${darkMode ? "text-white" : "text-red-500"}`}
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {/* Sort Option Dropdown */}
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className={`w-full my-3 p-2 border rounded-md ${darkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-100 border-gray-300 text-gray-800"
                            } outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="default">Default</option>
                        <option value="priceLowToHigh">Price: Low to High</option>
                        <option value="priceHighToLow">Price: High to Low</option>
                    </select>

                    {/* Category Filters */}
                    <div>
                        {Object.keys(filters).map((category) => {
                            const Icon = categoryIcons[category] || null;
                            return (
                                <div key={category} className="mb-4">
                                    {/* Category Header */}
                                    <div
                                        className={`flex items-center space-x-2 p-2 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-100"
                                            }`}
                                    >
                                        {Icon && (
                                            <Icon
                                                className={`text-lg ${darkMode ? "text-white" : "text-black"
                                                    }`}
                                            />
                                        )}
                                        <h3
                                            className={`text-base font-medium ${darkMode ? "text-white" : "text-gray-800"
                                                }`}
                                        >
                                            {category}
                                        </h3>
                                    </div>

                                    {/* Subcategory Checkboxes */}
                                    <div className="pl-3">
                                        {Object.keys(filters[category]).map((subCategory) => (
                                            <label
                                                key={subCategory}
                                                className={`flex items-center space-x-2 p-1 rounded-md cursor-pointer ${darkMode
                                                        ? "hover:bg-gray-600"
                                                        : "hover:bg-gray-200"
                                                    } transition-colors duration-200`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={filters[category][subCategory]}
                                                    onChange={() =>
                                                        handleFilterChange(category, subCategory)
                                                    }
                                                    className={`w-4 h-4 rounded ${darkMode
                                                            ? "border-gray-600 bg-gray-800 text-blue-500"
                                                            : "border-gray-300 bg-white text-blue-600"
                                                        } focus:ring-2 focus:ring-blue-500`}
                                                />
                                                <span
                                                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"
                                                        }`}
                                                >
                                                    {subCategory}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileFilter;