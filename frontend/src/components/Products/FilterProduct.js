import React, { useContext } from "react";
import {
    FaMobileAlt,
    FaLaptop,
    FaTshirt,
    FaCouch,
    FaShoppingBasket,
    FaUtensils,
    FaHeartbeat,
    FaBook,
    FaMagic,
    FaGamepad,
    FaCamera,
    FaBlender,
} from "react-icons/fa";
import { DarkModeContext } from "../../common/DarkModeContext";

export const categoryIcons = {
    Mobile: FaMobileAlt,
    Laptops: FaLaptop,
    Clothing: FaTshirt,
    Furniture: FaCouch,
    Groceries: FaShoppingBasket,
    Kitchen: FaUtensils,
    Health: FaHeartbeat,
    Books: FaBook,
    Beauty: FaMagic,
    Gaming: FaGamepad,
    Cameras: FaCamera,
    "Home Appliances": FaBlender,
};

const FilterProduct = ({ filters, sortOption, setSortOption, handleFilterChange }) => {
    const { darkMode } = useContext(DarkModeContext); // Access dark mode state

    return (
        <div
            className={`p-5 rounded-xl shadow-lg border ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } w-full md:w-68`}
        >
            <h2
                className={`font-semibold text-lg ${
                    darkMode ? "text-white" : "text-gray-800"
                } mb-3 border-b ${
                    darkMode ? "border-gray-600" : "border-gray-300"
                } pb-1 text-center uppercase tracking-wide`}
            >
                Filters
            </h2>

            {/* Sort Option Dropdown */}
            <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={`w-full mb-3 border ${
                    darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100 text-gray-800"
                } p-1.5 rounded-md outline-none focus:ring-2 focus:ring-blue-500`}
            >
                <option value="default">Default</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
            </select>

            {/* Category Filters */}
            {Object.keys(filters).map((category) => {
                const Icon = categoryIcons[category] || null;
                return (
                    <div key={category} className="mb-5">
                        {/* Category Header */}
                        <div
                            className={`flex items-center space-x-2 mb-2 p-1.5 rounded-md shadow-sm ${
                                darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                        >
                            {Icon && (
                                <Icon
                                    className={`text-lg ${
                                        darkMode ? "text-white" : "text-black"
                                    }`}
                                />
                            )}
                            <h3
                                className={`font-medium text-base ${
                                    darkMode ? "text-white" : "text-gray-900"
                                }`}
                            >
                                {category}
                            </h3>
                        </div>

                        {/* Subcategory Checkboxes */}
                        <div className="space-y-1">
                            {Object.keys(filters[category]).map((subCategory) => (
                                <label
                                    key={subCategory}
                                    className={`flex items-center space-x-2 p-1 rounded-md cursor-pointer transition duration-200 ${
                                        darkMode
                                            ? "hover:bg-gray-600"
                                            : "hover:bg-gray-200"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters[category][subCategory]}
                                        onChange={() =>
                                            handleFilterChange(category, subCategory)
                                        }
                                        className={`w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 ${
                                            darkMode
                                                ? "border-gray-600 bg-gray-800"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    <span
                                        className={`text-xs ${
                                            darkMode ? "text-gray-300" : "text-gray-700"
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
    );
};

export default FilterProduct;