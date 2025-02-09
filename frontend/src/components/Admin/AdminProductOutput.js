import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../common/DarkModeContext";

const AdminProductOutput = ({ products, renderStars, formatNumber, handleEdit, handleDelete }) => {
    const { darkMode } = useContext(DarkModeContext); // Access dark mode state
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

    // Filter products based on the search term (case-insensitive)
    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"} p-4 rounded-lg shadow-lg`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-700"}`}>Product List</h2>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by product title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                        darkMode
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            : "bg-white border-gray-200 text-gray-700 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 ${
                        darkMode ? "focus:ring-blue-500" : "focus:ring-blue-400"
                    }`}
                />
            </div>

            {/* Display filtered products or a message if no products are found */}
            {filteredProducts.length > 0 ? (
                <div className="overflow-x-auto">
                    {/* Add a fixed height and vertical scrollbar to the table container */}
                    <div className="max-h-[500px] overflow-y-auto">
                        <table className={`min-w-full border-collapse ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                            <thead>
                                <tr className={`${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                                    <th className={`border px-4 py-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>Image</th>
                                    <th className={`border px-4 py-2 sm:w-1/4 lg:w-1/5 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>Title</th>
                                    <th className={`border px-4 py-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>Category</th>
                                    <th className={`border px-4 py-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>Subcategory</th>
                                    <th className={`border px-4 py-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>Rating</th>
                                    <th className={`border px-4 py-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>Reviews</th>
                                    <th className={`border px-4 py-2 sm:w-1/3 lg:w-2/5 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>Description</th>
                                    <th className={`border px-4 py-2 sm:w-1/3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>Versions</th>
                                    <th className={`border px-4 py-2 sm:w-1/4 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className={`${darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"}`}>
                                        <td className={`border px-4 py-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                                            {product.image && (
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-12 h-16 object-cover"
                                                />
                                            )}
                                        </td>
                                        <td className={`border px-4 py-2 sm:w-1/4 lg:w-1/5 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>{product.title}</td>
                                        <td className={`border px-4 py-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>{product.category}</td>
                                        <td className={`border px-4 py-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>{product.subCategory}</td>
                                        <td className={`border px-4 py-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                                            <div className="flex items-center">
                                                {renderStars(product.rating)} {product.rating}
                                            </div>
                                        </td>
                                        <td className={`border px-4 py-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>{formatNumber(product.reviews)}</td>
                                        <td className={`border px-4 py-2 sm:w-1/3 lg:w-2/5 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                                            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{product.description || "No description provided"}</p>
                                        </td>
                                        <td className={`border px-4 py-2 sm:w-1/3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                                            <ul className="text-sm">
                                                {product.versions.map((version, index) => (
                                                    <li key={index} className="mb-2">
                                                        <strong>Version:</strong> {version.version} <br />
                                                        <strong>Initial Price:</strong> ₹{formatNumber(version.initialPrice)} <br />
                                                        <strong>Offer Price:</strong> ₹{formatNumber(version.offerPrice)} <br />
                                                        <strong>Discount:</strong>{" "}
                                                        {version.initialPrice > 0 && version.offerPrice > 0
                                                            ? `${(
                                                                ((version.initialPrice - version.offerPrice) / version.initialPrice) *
                                                                100
                                                            ).toFixed(2)}% off`
                                                            : "No discount"}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className={`border px-4 py-2 sm:w-1/4 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                                            <button
                                                className={`bg-yellow-500 text-white px-2 py-1 rounded mr-2 mb-2 hover:bg-yellow-400 ${
                                                    darkMode ? "hover:bg-yellow-600" : "hover:bg-yellow-400"
                                                }`}
                                                onClick={() => handleEdit(product)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={`bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400 ${
                                                    darkMode ? "hover:bg-red-600" : "hover:bg-red-400"
                                                }`}
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {searchTerm ? "No matching products found." : "No products found."}
                </p>
            )}
        </div>
    );
};

export default AdminProductOutput;