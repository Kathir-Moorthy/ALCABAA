import React, { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaStar } from "react-icons/fa";
import { DarkModeContext } from "../../common/DarkModeContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import auth from "../../config/firebase";

const BestBuy = ({ products }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [shuffledProducts, setShuffledProducts] = useState([]);
  const [popupProduct, setPopupProduct] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (Array.isArray(products)) {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      setShuffledProducts(shuffled);
    }
  }, [products]);

  useEffect(() => {
    if (popupProduct) {
      const baseVersion = popupProduct.versions.reduce((min, v) =>
        v.offerPrice < min.offerPrice ? v : min
      );
      setSelectedVersion(baseVersion);
    }
  }, [popupProduct]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closePopup();
      }
    };

    if (popupProduct) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [popupProduct]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Only after logging in you can add to cart!", {
        position: "top-center",
        autoClose: 2000,
      });
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

  const closePopup = () => {
    setPopupProduct(null);
    setSelectedVersion(null);
  };

  if (!Array.isArray(products) || products.length === 0) {
    return <p className="text-center">No products available.</p>;
  }

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
        style={{ zIndex: 999 }}
        theme={darkMode ? "dark" : "light"}
      />

      <div className="my-8">
        <h2 className={`font-bold sm:text-xl md:text-2xl mb-4 text-center ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
          Best Buy
        </h2>
        <Swiper
          spaceBetween={16}
          slidesPerView={3}
          grabCursor
          navigation
          modules={[Navigation]}
          breakpoints={{
            360: { slidesPerView: 2 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {shuffledProducts.slice(0, 8).map((product) => (
            <SwiperSlide key={product._id}>
              <div
                className={`border rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all ${darkMode ? "bg-gray-800" : "bg-white"
                  } flex flex-col items-center sm:p-3 product-card h-72`}
                onClick={() => setPopupProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-18 h-20 md:w-28 md:h-32 object-cover rounded-lg mb-3"
                />
                <h4 className={`font-bold text-sm mb-1 text-center ${darkMode ? "text-gray-200" : "text-gray-900"
                  }`}> {product.title} </h4>
                <p className={`text-sm flex justify-center items-center ${darkMode ? "text-gray-300" : "text-gray-600"
                  }`}> <FaStar className="text-yellow-500 mr-1" /> {product.rating} ({product.reviews.toLocaleString()}) </p>
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
                ? "bg-[#a36d3e] hover:bg-[#563a24]"
                : "hover:bg-[#986b41]"
                }`}
              disabled={!selectedVersion}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${darkMode ? "#2D3748" : "#EDF2F7"};
            border-radius: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${darkMode ? "#4A5568" : "#CBD5E0"};
            border-radius: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${darkMode ? "#718096" : "#A0AEC0"};
          }
        `}
      </style>
    </>
  );
};

export default BestBuy;