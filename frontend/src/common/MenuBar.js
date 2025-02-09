import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper and SwiperSlide
import 'swiper/css'; // Import Swiper core CSS
import 'swiper/css/navigation'; // Import Swiper navigation CSS
import { Navigation } from 'swiper/modules'; // Import Swiper Navigation module
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
} from 'react-icons/fa';
import { DarkModeContext } from './DarkModeContext'; // Import DarkModeContext

// Define categories array
const categories = [
  { name: 'Mobile', icon: <FaMobileAlt className="text-2xl" /> },
  { name: 'Laptops', icon: <FaLaptop className="text-2xl" /> },
  { name: 'Clothing', icon: <FaTshirt className="text-2xl" /> },
  { name: 'Furniture', icon: <FaCouch className="text-2xl" /> },
  { name: 'Groceries', icon: <FaShoppingBasket className="text-2xl" /> },
  { name: 'Kitchen', icon: <FaUtensils className="text-2xl" /> },
  { name: 'Health', icon: <FaHeartbeat className="text-2xl" /> },
  { name: 'Books', icon: <FaBook className="text-2xl" /> },
  { name: 'Beauty', icon: <FaMagic className="text-2xl" /> },
  { name: 'Gaming', icon: <FaGamepad className="text-2xl" /> },
  { name: 'Cameras', icon: <FaCamera className="text-2xl" /> },
  { name: 'Home Appliances', icon: <FaBlender className="text-2xl" /> },
];

const MenuBar = () => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    const params = new URLSearchParams();
    params.set('category', categoryName); // Set category filter in URL
    navigate(`/products?${params.toString()}`); // Navigate to /products with query parameter
  };

  return (
    <div
      className={`py-4 px-2 shadow-md transition-all duration-500 animate-fade-in ${
        darkMode ? 'bg-gray-900' : 'bg-[#F4EDE3]'
      }`}
    >
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        breakpoints={{
          480: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        navigation
        modules={[Navigation]}
        className="mySwiper"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <div
              className="flex flex-col items-center text-center group cursor-pointer"
              onClick={() => handleCategoryClick(category.name)} // Attach click handler
            >
              <div
                className={`rounded-full p-4 shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <span
                  className={`${
                    darkMode ? 'text-white' : 'text-[#8B6538]'
                  } transition-colors duration-300`}
                >
                  {category.icon}
                </span>
              </div>
              <span
                className={`mt-2 text-sm font-semibold transition-colors duration-300 group-hover:text-[#8B6538] ${
                  darkMode ? 'text-gray-400' : 'text-[#6B4A2F]'
                }`}
              >
                {category.name}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MenuBar;