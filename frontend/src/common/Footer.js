import React, { useContext } from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { DarkModeContext } from "./DarkModeContext"; // Import DarkModeContext

const Footer = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <footer
      className={`py-8 px-4 shadow-md transition-all duration-500 animate-fade-in ${
        darkMode
          ? "bg-gray-900 text-gray-300"
          : "bg-gradient-to-r from-[#8B6538] to-[#6B4A2F] text-white"
      }`}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo and Full Form */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="/logo.png"
            alt="ALCABAA Logo"
            className="w-20 h-20 object-contain mb-2"
          />
          <h1 className="text-lg font-bold">ALCABAA</h1>
          <p
            className={`text-sm text-center md:text-left ${
              darkMode ? "text-gray-400" : "text-gray-200"
            }`}
          >
            A Lifestyle Collection, Adorned with Balance, Authenticity, and Ambition
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center md:justify-between gap-8">
          {/* Company */}
          <div>
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-white" : "text-white"
              }`}
            >
              Company
            </h3>
            <ul className="space-y-1">
              <li className="hover:underline">
                <a href="/aboutus" className={`${darkMode ? "text-gray-400" : ""}`}>
                  About Us
                </a>
              </li>
              <li className="hover:underline">
                <span className={`${darkMode ? "text-gray-400" : ""}`}>
                  Careers
                </span>
              </li>
              <li className="hover:underline">
                <span className={`${darkMode ? "text-gray-400" : ""}`}>
                  Press
                </span>
              </li>
            </ul>
          </div>
          {/* Support */}
          <div>
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-white" : "text-white"
              }`}
            >
              Support
            </h3>
            <ul className="space-y-1">
              <li className="hover:underline">
                <span className={`${darkMode ? "text-gray-400" : ""}`}>
                  Help Center
                </span>
              </li>
              <li className="hover:underline">
                <span className={`${darkMode ? "text-gray-400" : ""}`}>
                  Privacy Policy
                </span>
              </li>
              <li className="hover:underline">
                <span className={`${darkMode ? "text-gray-400" : ""}`}>
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
          {/* Follow Us */}
          <div>
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-white" : "text-white"
              }`}
            >
              Follow Us
            </h3>
            <ul className="flex space-x-4">
              <li className="hover:scale-110 transition-transform duration-300">
                <a href="#" aria-label="Facebook">
                  <FaFacebookF
                    className={`text-xl ${
                      darkMode ? "text-gray-400" : "text-white"
                    }`}
                  />
                </a>
              </li>
              <li className="hover:scale-110 transition-transform duration-300">
                <a href="#" aria-label="Twitter">
                  <FaTwitter
                    className={`text-xl ${
                      darkMode ? "text-gray-400" : "text-white"
                    }`}
                  />
                </a>
              </li>
              <li className="hover:scale-110 transition-transform duration-300">
                <a href="#" aria-label="Instagram">
                  <FaInstagram
                    className={`text-xl ${
                      darkMode ? "text-gray-400" : "text-white"
                    }`}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        className={`text-center text-sm mt-8 ${
          darkMode ? "text-gray-500" : "text-gray-300"
        }`}
      >
        © {new Date().getFullYear()} ALCABAA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;