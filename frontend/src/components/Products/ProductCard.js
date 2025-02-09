import React, { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import auth from "../../config/firebase";
import { DarkModeContext } from "../../common/DarkModeContext";

const ProductCard = ({
  filteredProducts,
  sortProducts,
  popupProduct,
  setPopupProduct,
  closePopup,
}) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { darkMode } = useContext(DarkModeContext); // Access dark mode state

  useEffect(() => {
    if (popupProduct) {
      const baseVersion = popupProduct.versions.reduce((min, v) =>
        v.offerPrice < min.offerPrice ? v : min
      );
      setSelectedVersion(baseVersion);
    }
  }, [popupProduct]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closePopup();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closePopup]);

  const handleAddToCart = async () => {
    if (!user) {
      // Show the toast message first
      toast.error("Only after logging in you can add to cart!", {
        position: "top-center",
        autoClose: 2000,
      });
  
      // Delay the navigation by 2 seconds (same as the toast's autoClose time)
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cart/add`, {
          userId: user.uid,
          productId: popupProduct._id,
          title: popupProduct.title,
          image: popupProduct.image,
          version: selectedVersion.version,
          offerPrice: selectedVersion.offerPrice,
        });
  
        toast.success(`${popupProduct.title} added to cart successfully!`, {
          position: "top-center",
          autoClose: 2000,
        });
      } catch {
        toast.error("Failed to add to cart", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 999 }} // Add this line to ensure the toast appears above the popup
        theme={darkMode ? "dark" : "light"} // Add this line to set the theme dynamically
      />

      {Object.keys(
        filteredProducts.reduce((result, product) => {
          result[product.category] = true;
          return result;
        }, {})
      ).map((category) => (
        <div key={category} className="mb-8">
          <h2 className={`font-bold text-xl mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            {category}
          </h2>
          <Swiper
            spaceBetween={16}
            slidesPerView={3}
            grabCursor
            navigation
            modules={[Navigation]}
            breakpoints={{
              360: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {sortProducts(
              filteredProducts.filter((product) => product.category === category)
            ).map((product) => (
              <SwiperSlide key={product._id}>
                <div
                  className={`border rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all ${darkMode ? "bg-gray-800" : "bg-white"
                    } flex flex-col items-center sm:p-3 product-card`}
                  onClick={() => setPopupProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-18 h-20 md:w-28 md:h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className={`font-bold text-sm mb-1 text-center ${darkMode ? "text-gray-200" : "text-gray-900"
                    }`}>
                    {product.title}
                  </h4>
                  <p className={`text-sm flex justify-center items-center ${darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                    <FaStar className="text-yellow-500 mr-1" />
                    {product.rating} ({product.reviews.toLocaleString()})
                  </p>
                  <p className="text-sm line-through text-red-500">
                    ₹{Math.min(...product.versions.map((v) => v.initialPrice)).toLocaleString()}
                  </p>
                  <p className="text-lg font-semibold text-green-600 flex items-center">
                    ₹{Math.min(...product.versions.map((v) => v.offerPrice)).toLocaleString()}
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded ml-2">
                      {Math.max(...product.versions.map(
                        (v) => (((v.initialPrice - v.offerPrice) / v.initialPrice) * 100).toFixed(2)
                      ))}% OFF
                    </span>
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}

      {popupProduct && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closePopup}
        >
          <div
            className={`relative p-6 rounded-lg shadow-2xl w-11/12 sm:w-4/5 max-h-[70vh] sm:max-h-[80vh] overflow-y-auto custom-scrollbar ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`absolute top-2 right-2 font-bold text-lg ${darkMode ? "text-white" : "text-red-600"
                }`}
              onClick={closePopup}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2 text-center">{popupProduct.title}</h2>

            <img
              src={popupProduct.image}
              alt={popupProduct.title}
              className="w-full md:max-h-48 sm:max-h-40 object-contain rounded mb-4 popup-image"
            />

            {/* Conditionally render version selection or display the single version with the same style */}
            {popupProduct.versions.length > 1 ? (
              <>
                <h3 className="font-semibold mb-2">Select a Version</h3>
                <div className="mb-4 flex flex-wrap gap-2">
                  {popupProduct.versions.map((version, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg px-4 py-2 cursor-pointer transition-all ${selectedVersion?.version === version.version
                        ? darkMode
                          ? "border-blue-500 bg-blue-900"
                          : "border-blue-500 bg-blue-100"
                        : darkMode
                          ? "border-gray-600 bg-gray-800"
                          : "border-gray-300"
                        }`}
                      onClick={() => setSelectedVersion(version)}
                    >
                      {version.version}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mb-4 flex flex-wrap gap-2">
                <div
                  className={`border rounded-lg px-4 py-2 cursor-pointer transition-all ${darkMode ? "border-blue-500 bg-blue-900" : "border-blue-500 bg-blue-100"
                    }`}
                >
                  {popupProduct.versions[0].version}
                </div>
              </div>
            )}

            {selectedVersion && (
              <>
                <p className="text-lg font-semibold text-green-600">
                  ₹{selectedVersion.offerPrice.toLocaleString()} {" "}
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {(((selectedVersion.initialPrice - selectedVersion.offerPrice) / selectedVersion.initialPrice) * 100).toFixed(2)}% OFF
                  </span>
                </p>
                <p className="text-sm line-through text-red-500">
                  ₹{selectedVersion.initialPrice.toLocaleString()}
                </p>
              </>
            )}

            <h3 className="font-semibold mt-4 mb-2">Description</h3>
            <p className="mb-2">{popupProduct.description}</p>

            <button
              className={`bg-[#735131] text-white px-6 py-2 rounded-lg sm:w-[40%] md:w-[30%] font-semibold disabled:bg-gray-400 block mx-auto ${darkMode
                ? "bg-[#a36d3e] hover:bg-[#563a24]" // Dark mode background and hover
                : "hover:bg-[#986b41]" // Light mode hover
                }`}
              disabled={!selectedVersion}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${darkMode ? "#374151" : "#f1f1f1"};
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${darkMode ? "#6b7280" : "#888"};
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${darkMode ? "#4b5563" : "#555"};
                }
                .product-card {
                    height: 100%; /* Ensure all cards take up the same height */
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between; /* Distribute space evenly */
                }
                .product-card h4 {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2; /* Limit title to 2 lines */
                    -webkit-box-orient: vertical;
                }
                @media (max-width: 640px) {
                    .product-card {
                        padding: 12px;
                        text-align: center;
                    }
                    .product-card img {
                        width: 100%;
                        height: auto;
                        object-fit: contain;
                    }
                    .product-card h4 {
                        font-size: 14px;
                    }
                }
            `}</style>
    </>
  );
};

export default ProductCard;