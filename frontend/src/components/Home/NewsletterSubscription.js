import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { DarkModeContext } from "../../common/DarkModeContext";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const { darkMode } = useContext(DarkModeContext);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email!", { position: "top-center" });
      return;
    }
    toast.success("Thank you for Subscribing!", { position: "top-center" });
    setEmail("");
  };

  return (
    <div
      className={`p-6 rounded-xl text-center shadow-lg transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-800"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-4">Subscribe for Updates</h2>
      <p className="mb-3">Get notified about new products & exclusive offers.</p>
      <div className="flex justify-center items-center mb-10">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`p-3 border rounded-l-full w-64 focus:outline-none transition-all duration-300 ${
            darkMode ? "bg-gray-800 text-gray-200 border-gray-600" : "bg-white border-gray-300"
          }`}
        />
        <button
          onClick={handleSubscribe}
          className={`px-5 py-3 rounded-r-full flex items-center gap-2 transition-all duration-300 ${
            darkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-[#704E30] text-white hover:bg-[#ab7243]"
          }`}
        >
          Subscribe <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default NewsletterSubscription;