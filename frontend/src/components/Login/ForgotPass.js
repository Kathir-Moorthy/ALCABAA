import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DarkModeContext } from "../../common/DarkModeContext";
import { sendPasswordResetEmail } from "firebase/auth";
import auth from "../../config/firebase";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const { darkMode } = useContext(DarkModeContext);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email has been sent!", {
        position: "top-center",
      });
      setEmail(""); // Clear input field after submission
    } catch (error) {
      // Handle specific Firebase error codes
      if (error.code === "auth/user-not-found") {
        toast.error("Email is not registered.", {
          position: "top-center",
        });
      } else {
        toast.error("An error occurred. Please try again.", {
          position: "top-center",
        });
      }
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen animate-fade-in transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Forgot Password */}
      <div
        className={`shadow-lg rounded-lg p-8 max-w-md w-full transition-all duration-500 ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <h2
          className={`text-3xl font-semibold text-center mb-6 ${
            darkMode ? "text-[#D4A373]" : "text-[#75351f]"
          }`}
        >
          Forgot Your Password?
        </h2>
        <p className={`text-sm text-center mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Enter your registered email, and we’ll send you instructions to reset your password.
        </p>
        <form onSubmit={handleReset}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-gray-500"
                  : "bg-white border-gray-300 focus:ring-blue-500"
              }`}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md shadow-md focus:outline-none focus:ring-2 bg-[#7A5733] text-white hover:bg-[#8B6538] focus:ring-slate-200`}
          >
            Reset Your Password
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className={`flex-grow h-px ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}></div>
          <span className={`mx-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>OR</span>
          <div className={`flex-grow h-px ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}></div>
        </div>

        <p className={`text-sm text-center mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Know your password?{" "}
          <Link
            to="/login"
            className={`${
              darkMode ? "text-blue-400 hover:underline" : "text-blue-600 hover:underline"
            }`}
          >
            Login
          </Link>
        </p>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default ForgotPass;