import React, { useRef, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DarkModeContext } from "../../common/DarkModeContext";

const AdminProductInput = ({
    formData,
    setFormData,
    categories,
    handleSave,
    resetForm,
    isEditing,
    addVersion,
    removeVersion,
}) => {
    const fileInputRef = useRef(null); // Ref for the file input
    const { darkMode } = useContext(DarkModeContext); // Access dark mode state

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleVersionChange = (index, field, value) => {
        const updatedVersions = [...formData.versions];
        updatedVersions[index][field] = value;

        if (field === "initialPrice" || field === "offerPrice") {
            const initialPrice = parseFloat(updatedVersions[index].initialPrice || 0);
            const offerPrice = parseFloat(updatedVersions[index].offerPrice || 0);
            updatedVersions[index].offerPercent =
                initialPrice > 0 && offerPrice > 0
                    ? (((initialPrice - offerPrice) / initialPrice) * 100).toFixed(2)
                    : "";
        }
        setFormData({ ...formData, versions: updatedVersions });
    };

    const validateForm = () => {
        // Check if all required fields are filled
        if (
            !formData.image ||
            !formData.title ||
            !formData.category ||
            !formData.subCategory ||
            !formData.rating ||
            !formData.reviews ||
            !formData.description
        ) {
            toast.error("All fields are required!", {
                position: "top-center",
                autoClose: 3000,
            });
            return false;
        }

        // Check if rating is between 0 and 5
        if (formData.rating < 0 || formData.rating > 5) {
            toast.error("Rating must be between 0 and 5!", {
                position: "top-center",
                autoClose: 3000,
            });
            return false;
        }

        // Check if at least one version is added
        if (formData.versions.length === 0) {
            toast.error("At least one version is required!", {
                position: "top-center",
                autoClose: 3000,
            });
            return false;
        }

        // Check if offer price is less than initial price for all versions
        for (const version of formData.versions) {
            if (
                parseFloat(version.offerPrice) >= parseFloat(version.initialPrice)
            ) {
                toast.error("Offer price must be less than initial price!", {
                    position: "top-center",
                    autoClose: 3000,
                });
                return false;
            }
        }

        return true; // All validations passed
    };

    const handleSaveWithReset = () => {
        if (!validateForm()) return; // Stop if validation fails

        handleSave(); // Call the original handleSave function
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input field
        }
    };

    return (
        <div
            className={`p-6 rounded-lg shadow-lg mb-6 outline-none ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
            }`}
        >
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <input
                    type="file"
                    name="image"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className={`w-full border rounded p-2 outline-none focus:ring-2 ${
                        darkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                    }`}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Product Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full border rounded p-2 outline-none focus:ring-2 ${
                        darkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                    }`}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value, subCategory: "" })
                    }
                    className={`w-full border rounded p-2 outline-none focus:ring-2 ${
                        darkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                    }`}
                    required
                >
                    <option value="">Select Category</option>
                    {Object.keys(categories).map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
            {formData.category && categories[formData.category] && (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Subcategory</label>
                    <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        className={`w-full border rounded p-2 outline-none focus:ring-2 ${
                            darkMode
                                ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
                                : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                        }`}
                        required
                    >
                        <option value="">Select Subcategory</option>
                        {categories[formData.category].map((sub) => (
                            <option key={sub} value={sub}>
                                {sub}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    max="5"
                    min="0"
                    step="0.1"
                    className={`w-full border rounded p-2 outline-none focus:ring-2 ${
                        darkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                    }`}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Number of Reviews</label>
                <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleInputChange}
                    className={`w-full border rounded p-2 outline-none focus:ring-2 ${
                        darkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                    }`}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full border rounded p-2 outline-none focus:ring-2 ${
                        darkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                    }`}
                    required
                ></textarea>
            </div>
            <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Versions / Sizes</h3>
                {formData.versions.map((version, index) => (
                    <div
                        key={index}
                        className={`border p-4 rounded mb-2 ${
                            darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                        }`}
                    >
                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">Version</label>
                            <input
                                type="text"
                                value={version.version}
                                onChange={(e) => handleVersionChange(index, "version", e.target.value)}
                                className={`w-full border rounded p-2 outline-none focus:ring-2 ${
                                    darkMode
                                        ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
                                        : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                                }`}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">Initial Price</label>
                            <input
                                type="number"
                                value={version.initialPrice}
                                onChange={(e) =>
                                    handleVersionChange(index, "initialPrice", e.target.value)
                                }
                                className={`w-full border rounded p-2 outline-none focus:ring-2 ${
                                    darkMode
                                        ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
                                        : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                                }`}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">Offer Price</label>
                            <input
                                type="number"
                                value={version.offerPrice}
                                onChange={(e) =>
                                    handleVersionChange(index, "offerPrice", e.target.value)
                                }
                                className={`w-full border rounded p-2 outline-none focus:ring-2 ${
                                    darkMode
                                        ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
                                        : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                                }`}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">Offer Percent</label>
                            <input
                                type="text"
                                value={version.offerPercent}
                                readOnly
                                className={`w-full border rounded p-2 outline-none focus:ring-2 ${
                                    darkMode
                                        ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
                                        : "bg-gray-100 border-gray-300 text-gray-700 focus:ring-blue-500"
                                }`}
                                placeholder="Auto-calculated"
                            />
                        </div>
                        {formData.versions.length > 1 && (
                            <button
                                type="button"
                                className={`bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-400 ${
                                    darkMode ? "hover:bg-red-600" : "hover:bg-red-400"
                                }`}
                                onClick={() => removeVersion(index)}
                            >
                                Remove Version
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    className={`bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-400 ${
                        darkMode ? "bg-green-700 hover:bg-green-800" : "hover:bg-green-400"
                    }`}
                    onClick={addVersion}
                >
                    Add Version
                </button>
            </div>
            <div>
                <button
                    type="button"
                    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 ${
                        darkMode ? "bg-blue-700 hover:bg-blue-800" : "hover:bg-blue-400"
                    }`}
                    onClick={handleSaveWithReset}
                >
                    {isEditing ? "Update Product" : "Add Product"}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        className={`bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-400 ${
                            darkMode ? "hover:bg-gray-600" : "hover:bg-gray-400"
                        }`}
                        onClick={resetForm}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdminProductInput;