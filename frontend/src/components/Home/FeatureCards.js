import { FaShippingFast, FaLock, FaHeadset } from "react-icons/fa";
import { useContext } from "react";
import { DarkModeContext } from "../../common/DarkModeContext";

const FeatureCards = () => {
  const { darkMode } = useContext(DarkModeContext);
  const iconColor = darkMode ? "#E4E4E7" : "#775433"; // Adjusted for dark mode

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-6">
      {/* Card 1 - Shipping */}
      <div
        className={`p-4 md:p-6 shadow-lg rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${
          darkMode
            ? "border-gray-700 bg-gray-800 text-gray-300"
            : "border-gray-300 bg-white text-gray-600"
        }`}
      >
        <FaShippingFast size={40} className="md:size-50" color={iconColor} />
        <h3
          className="text-lg md:text-xl font-bold mt-3 md:mt-4"
          style={{ color: darkMode ? "#E4E4E7" : "#775433" }}
        >
          Fast & Reliable Shipping
        </h3>
        <p className="text-sm md:text-base mt-2">
          Get your orders quickly with our efficient logistics.
        </p>
      </div>

      {/* Card 2 - Secure Payments */}
      <div
        className={`p-4 md:p-6 shadow-lg rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${
          darkMode
            ? "border-gray-700 bg-gray-800 text-gray-300"
            : "border-gray-300 bg-white text-gray-600"
        }`}
      >
        <FaLock size={40} className="md:size-50" color={iconColor} />
        <h3
          className="text-lg md:text-xl font-bold mt-3 md:mt-4"
          style={{ color: darkMode ? "#E4E4E7" : "#775433" }}
        >
          Secure Payments
        </h3>
        <p className="text-sm md:text-base mt-2">
          Your transactions are protected with top security.
        </p>
      </div>

      {/* Card 3 - Customer Support */}
      <div
        className={`p-4 md:p-6 shadow-lg rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${
          darkMode
            ? "border-gray-700 bg-gray-800 text-gray-300"
            : "border-gray-300 bg-white text-gray-600"
        }`}
      >
        <FaHeadset size={40} className="md:size-50" color={iconColor} />
        <h3
          className="text-lg md:text-xl font-bold mt-3 md:mt-4"
          style={{ color: darkMode ? "#E4E4E7" : "#775433" }}
        >
          24/7 Customer Support
        </h3>
        <p className="text-sm md:text-base mt-2">
          Our team is here to assist you anytime.
        </p>
      </div>
    </div>
  );
};

export default FeatureCards;