import React, { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { DarkModeContext } from "../../common/DarkModeContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SaleImage = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [saleImages, setSaleImages] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch images from the API
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/images`);
      if (response.data && Array.isArray(response.data)) {
        setSaleImages(response.data);
      }
    } catch {
    }
  };

  useEffect(() => {
    fetchImages(); // Initial fetch
  }, []);

  return (
    <div
      className={`pb-8 shadow-md transition-all duration-500 ${
        darkMode ? "bg-gray-900" : "bg-[#F4EDE3]"
      }`}
    >
      {/* SaleImages */}
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        loop={saleImages.length > 1} // Enable loop only if multiple slides exist
        updateOnWindowResize
        className="saleSwiper"
      >
        {saleImages.map((image) => (
          <SwiperSlide key={image._id || image.url}>
            <div className="relative group">
              <img
                src={image.url}
                alt="Sale Image"
                className={`w-full h-[200px] md:h-[250px] lg:h-[300px] object-cover transition duration-300 opacity-70 brightness-75 group-hover:opacity-100 group-hover:brightness-100 ${
                  darkMode ? "filter grayscale-50" : ""
                }`}
              />
              <button
                onClick={() => navigate("/products")} // Navigate to /products on click
                className={`absolute bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-2 text-sm md:text-base font-semibold rounded-lg shadow-lg transition z-10 ${
                  darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-[#8B6538] text-white hover:bg-[#6B4A2F]"
                }`}
              >
                Shop Now
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SaleImage;