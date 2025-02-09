import React, { useContext, useState, useEffect, useRef } from 'react';
import { DarkModeContext } from './DarkModeContext';
import { FaShoppingCart, FaMoon, FaSun, FaBars, FaPhoneAlt, FaUser, FaCashRegister, FaChevronDown, FaBoxOpen, FaInfoCircle, FaCrown, FaCogs } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import SideMenu from './SideMenu';
import SearchBar from './SearchBar';
import auth from '../config/firebase'; // Firebase auth instance
import axios from 'axios'; // For API calls

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null); // Track user state
  const [cartCount, setCartCount] = useState(0); // Track cart item count
  const [loadingCart, setLoadingCart] = useState(false); // Track cart loading state
  const firebaseUID = process.env.REACT_APP_FIREBASE_UID;
  const dropdownRef = useRef(null); // Ref for the dropdown menu
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle Logout
  const handleLogout = async () => {
    await auth.signOut();
    setUser(null); // Reset user state
    setCartCount(0); // Reset cart count
    navigate('/login'); // Redirect to login page
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch cart data when user is logged in
  const fetchCart = async () => {
    if (user) {
      setLoadingCart(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${user.uid}`);
        setCartCount(response.data.items.length); // Set cart count
      } catch {
      } finally {
        setLoadingCart(false);
      }
    } else {
      setCartCount(0); // Reset cart count if user logs out
    }
  };

  // Fetch cart data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCart();
    }, 5000); // Fetch cart data every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [user]);

  // Extract the first name from displayName or email
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0];

  // Close dropdown on Escape key or click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen]);

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between px-4 py-3 animate-slide-in ${darkMode
        ? 'bg-gray-900 text-white'
        : 'bg-gradient-to-r from-[#8B6538] to-[#6B4A2F] text-white'
        } shadow-md transition-all duration-500`}
    >
      {/* Logo Section */}
      <Link to="/" className="flex items-center space-x-3" title="Home Page">
        <img src="logo.png" alt="ALCABAA Logo" className="sm:h-5 sm:w-5 h-7 w-7" />
        <span className="sm:text-sm text-lg font-bold">ALCABAA</span>
      </Link>

      {/* SearchBar Section */}
      <div className="flex flex-grow mx-4 sm:mx-2">
        <SearchBar />
      </div>

      {/* Icons and Buttons Section */}
      <div className="hidden md:flex items-center space-x-5 relative">
        {/* Shopping Cart Icon with Count */}
        <div className="relative">
          <FaShoppingCart
            className="text-xl cursor-pointer hover:text-[#efb78a]"
            title="Cart"
            onClick={() => handleNavigation('/cart')}
          />
          {user && (
            <span
              className={`absolute -top-2 -right-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-red-500 text-white'
                }`}
            >
              {loadingCart ? '...' : cartCount}
            </span>
          )}
        </div>

        {/* Dark Mode Toggle */}
        {darkMode ? (
          <FaSun
            className="text-xl cursor-pointer hover:text-[#efb78a]"
            title="Light Mode"
            onClick={toggleDarkMode}
          />
        ) : (
          <FaMoon
            className="text-xl cursor-pointer hover:text-[#efb78a]"
            title="Dark Mode"
            onClick={toggleDarkMode}
          />
        )}

        {/* Contact Us Button */}
        <button
          onClick={() => handleNavigation('/contactus')}
          className={`flex items-center px-4 py-2 ${darkMode
            ? 'bg-gray-800 text-white hover:bg-gray-700'
            : 'bg-white text-[#8B6538] hover:bg-[#6B4A2F] hover:text-white'
            } rounded-md transition duration-300 sm:px-3 sm:py-1 sm:text-sm`} title="Contact Us"
        >
          <FaPhoneAlt className="mr-2 sm:text-sm text-lg" />
          <span>Contact Us</span>
        </button>

        {/* Login/Logout and Dropdown */}
        <div className="flex items-center relative" ref={dropdownRef}>
          {/* Conditional Rendering for Login/Logout */}
          {user ? (
            <>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`flex items-center justify-center px-4 py-2 ${darkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-[#8B6538] hover:bg-[#6B4A2F] hover:text-white'
                  } rounded-l-md transition duration-300 sm:px-3 sm:py-1 sm:text-sm`} title="Logout"
              >
                Logout
              </button>
              {/* Downward Arrow */}
              <button
                onClick={toggleDropdown}
                className={`flex items-center justify-center px-4 py-2 ${darkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-[#8B6538] hover:bg-[#6B4A2F] hover:text-white'
                  } rounded-r-md transition duration-300 sm:px-2 sm:py-1 sm:text-sm`}
              >
                <FaChevronDown className="text-xl" />
              </button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <button
                onClick={() => handleNavigation('/login')}
                className={`flex items-center justify-center px-4 py-2 ${darkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-[#8B6538] hover:bg-[#6B4A2F] hover:text-white'
                  } rounded-l-md transition duration-300 sm:px-3 sm:py-1 sm:text-sm`} title="Login"
              >
                Login
              </button>
              {/* Downward Arrow */}
              <button
                onClick={toggleDropdown}
                className={`flex items-center justify-center px-4 py-2 outline-none ${darkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-[#8B6538] hover:bg-[#6B4A2F] hover:text-white'
                  } rounded-r-md transition duration-300 sm:px-2 sm:py-1 sm:text-sm`}
              >
                <FaChevronDown className="text-xl" />
              </button>
            </>
          )}

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className={`absolute z-20 top-full right-0 mt-2 ${darkMode
                ? 'bg-gray-800 text-white'
                : 'bg-gradient-to-r from-[#8B6538] to-[#6B4A2F] text-white'
                } rounded-md shadow-lg py-2 w-48`}
            >
              {user ? (
                <>
                  <div
                    onClick={() => handleNavigation('/profile')}
                    className={`block px-4 py-2 flex items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#6B4A2F]'
                      } transition duration-300 cursor-pointer`}
                  >
                    <FaUser className="mr-2" /> Hi {firstName}
                  </div>
                  <div
                    onClick={() => handleNavigation('/settings')}
                    className={`block px-4 py-2 flex items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#6B4A2F]'
                      } transition duration-300 cursor-pointer`}
                  >
                    <FaCogs className="mr-2" /> Settings
                  </div>

                  {/* Admin Option for Specific UID */}
                  {user.uid === firebaseUID && (
                    <div
                      onClick={() => handleNavigation('/adminaccess')}
                      className={`block px-4 py-2 flex items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#6B4A2F]'
                        } transition duration-300 cursor-pointer`}
                    >
                      <FaCrown className="mr-2" /> Admin
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/signup"
                  className={`block px-4 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#6B4A2F]'
                    } transition duration-300`}
                >
                  New Customer? <span className="underline">Signup</span>
                </Link>
              )}

              {/* Products Option */}
              <div
                onClick={() => handleNavigation('/products')}
                className={`block px-4 py-2 flex items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#6B4A2F]'
                  } transition duration-300 cursor-pointer`}
              >
                <FaBoxOpen className="mr-2" /> Products
              </div>

              {/*About Us Option */}
              <div
                onClick={() => handleNavigation('/aboutus')}
                className={`block px-4 py-2 flex items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#6B4A2F]'
                  } transition duration-300 cursor-pointer`}
              >
                <FaInfoCircle className="mr-2" /> About Us
              </div>

              {/*Check Out Option */}
              <div
                onClick={() => handleNavigation('/checkout')}
                className={`block px-4 py-2 flex items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-[#6B4A2F]'
                  } transition duration-300 cursor-pointer`}
              >
                <FaCashRegister className="mr-2" /> Check Out
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Icon for Small Screens */}
      <div className="md:hidden">
        <FaBars
          className="text-xl sm:text-lg cursor-pointer"
          onClick={toggleMenu}
          title="Menu"
        />
      </div>

      {/* Side Menu for Small Screens */}
      <SideMenu
        toggleMenu={toggleMenu}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        menuOpen={menuOpen}
      />
    </nav>
  );
};

export default Navbar;