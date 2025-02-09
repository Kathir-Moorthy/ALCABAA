import React, { useContext, useEffect, useState } from 'react';
import { DarkModeContext } from './DarkModeContext';
import {
  FaShoppingCart,
  FaMoon,
  FaSun,
  FaHome,
  FaInfoCircle,
  FaBoxOpen,
  FaBox,
  FaPhone,
  FaUser,
  FaCrown,
  FaCashRegister,
  FaCog,
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import auth from '../config/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SideMenu = ({ toggleMenu, menuOpen }) => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const firebaseUID = process.env.REACT_APP_FIREBASE_UID;
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(0); // State to track cart item count

  useEffect(() => {
    const fetchCart = async () => {
      if (auth.currentUser) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${auth.currentUser.uid}`);
          // Set cart count to 0 if items array is missing or empty
          setCartItemCount(response.data.items?.length || 0);
        } catch {
          setCartItemCount(0); // Set cart count to 0 in case of an error
        }
      } else {
        setCartItemCount(0); // Reset cart count if user logs out
      }
    };

    // Fetch cart data immediately when the component mounts
    fetchCart();

    // Set up an interval to fetch cart data every 5 seconds
    const interval = setInterval(() => {
      fetchCart();
    }, 5000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [auth.currentUser]); // Re-run effect when the user changes

  // Handle Escape key to close the menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        toggleMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleMenu, menuOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    toggleMenu();
  };

  const isActive = (path) => location.pathname === path;

  const handleAuthAction = () => {
    if (auth.currentUser) {
      auth.signOut().then(() => {
        navigate('/login');
        toggleMenu();
      });
    } else {
      handleNavigation('/login');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleMenu();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end transition-opacity duration-300 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`${darkMode
            ? 'bg-gray-900 text-white'
            : 'bg-gradient-to-r from-[#8B6538] to-[#6B4A2F]'
          } w-60 h-full shadow-lg flex flex-col p-5 space-y-5 relative overflow-y-auto
        transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'
          }
        scrollbar-thin scrollbar-thumb-rounded-md ${darkMode
            ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800'
            : 'scrollbar-thumb-[#D6B48B] scrollbar-track-[#FFF5E5]'
          }`}
      >
        {/* Close Button */}
        <MdClose
          className="absolute top-3 right-3 text-xl cursor-pointer"
          onClick={toggleMenu}
          title="Close"
        />

        {/* Menu Items */}
        <div
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive('/') ? (darkMode ? 'bg-gray-800' : 'bg-[#D6B48B]') : ''
            }`}
          onClick={() => handleNavigation('/')}
        >
          <FaHome className="text-lg" />
          <span className="text-md">Home</span>
        </div>

        {/* About Us */}
        <div
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive('/aboutus') ? (darkMode ? 'bg-gray-800' : 'bg-[#D6B48B]') : ''
            }`}
          onClick={() => handleNavigation('/aboutus')}
        >
          <FaInfoCircle className="text-lg" />
          <span className="text-md">About Us</span>
        </div>

        {/* Products */}
        <div
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive('/products') ? (darkMode ? 'bg-gray-800' : 'bg-[#D6B48B]') : ''
            }`}
          onClick={() => handleNavigation('/products')}
        >
          <FaBoxOpen className="text-lg" />
          <span className="text-md">Products</span>
        </div>

        {auth.currentUser && (
          <>
            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive('/profile')
                  ? darkMode
                    ? 'bg-gray-800'
                    : 'bg-[#D6B48B]'
                  : ''
                }`}
              onClick={() => handleNavigation('/profile')}
            >
              <FaUser className="text-lg" />
              <span className="text-md">My Profile</span>
            </div>
            {auth.currentUser.uid === firebaseUID && (
              <div
                className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive('/adminaccess')
                    ? darkMode
                      ? 'bg-gray-800'
                      : 'bg-[#D6B48B]'
                    : ''
                  }`}
                onClick={() => handleNavigation('/adminaccess')}
              >
                <FaCrown className="text-lg" />
                <span className="text-md">Admin</span>
              </div>
            )}

            {/* Cart with Item Count */}
            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive('/cart')
                  ? darkMode
                    ? 'bg-gray-800'
                    : 'bg-[#D6B48B]'
                  : ''
                }`}
              onClick={() => handleNavigation('/cart')}
            >
              <div className="relative">
                <FaShoppingCart className="text-lg" />
                {cartItemCount >= 0 && (
                  <div
                    className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'
                      }`}
                  >
                    {cartItemCount}
                  </div>
                )}
              </div>
              <span className="text-md">Cart</span>
            </div>

            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive('/checkout') ? (darkMode ? 'bg-gray-800' : 'bg-[#D6B48B]') : ''
                }`}
              onClick={() => handleNavigation('/checkout')}
            >
              <FaCashRegister className="text-lg" />
              <span className="text-md">Check Out</span>
            </div>

            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive('/contactus')
                  ? darkMode
                    ? 'bg-gray-800'
                    : 'bg-[#D6B48B]'
                  : ''
                }`}
              onClick={() => handleNavigation('/contactus')}
            >
              <FaPhone className="text-lg" />
              <span className="text-md">Contact</span>
            </div>

            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive('/settings')
                  ? darkMode
                    ? 'bg-gray-800'
                    : 'bg-[#D6B48B]'
                  : ''
                }`}
              onClick={() => handleNavigation('/settings')}
            >
              <FaCog className="text-lg" />
              <span className="text-md">Settings</span>
            </div>
          </>
        )}

        {/* Dark Mode Toggle */}
        <div
          className="pl-2 flex items-center space-x-2 cursor-pointer"
          onClick={toggleDarkMode}
        >
          {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
          <span className="text-md">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </div>

        {/* Auth Button */}
        <button
          onClick={handleAuthAction}
          className={`w-full px-3 py-1.5 rounded-md transition duration-300 ${darkMode
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-white text-[#8B6538] hover:bg-[#6B4A2F] hover:text-white'
            }`}
        >
          {auth.currentUser ? 'Logout' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default SideMenu;