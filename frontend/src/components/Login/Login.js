import React, { useState, useContext, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { DarkModeContext } from "../../common/DarkModeContext";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth from "../../config/firebase";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/"); // Redirect to home if user is already logged in
      }
    });

    return () => unsubscribe(); // Clean up the subscription on component unmount
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          toast.error("User does not exist");
          break;
        case "auth/wrong-password":
          toast.error("Password is incorrect");
          break;
        default:
          toast.error("An error occurred. Please try again.");
          break;
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Google login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen animate-fade-in p-4 ${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"
      }`}
    >
      {/* Login */}
      <div
        className={`shadow-lg rounded-lg p-6 sm:p-8 max-w-sm sm:max-w-md w-full transition-all duration-500 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8 ${
            darkMode ? "text-[#D1A26F]" : "text-[#75351f]"
          }`}
        >
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-1 sm:mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className={`w-full px-3 sm:px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                darkMode
                  ? "border-gray-600 bg-gray-700 text-gray-300"
                  : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 sm:mb-6 relative">
            <label
              htmlFor="password"
              className={`block text-sm font-medium mb-1 sm:mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className={`w-full px-3 sm:px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-gray-300"
                    : "border-gray-300"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-2 sm:right-3 flex items-center text-lg sm:text-xl ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } hover:text-gray-700`}
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <a
              href="/forgotpassword"
              className={`text-xs sm:text-sm ${
                darkMode ? "text-blue-400" : "text-blue-600"
              } hover:underline`}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-300 text-sm sm:text-base ${
              darkMode
                ? "bg-[#8B6538] text-gray-200 hover:bg-[#A27850]"
                : "bg-[#7A5733] text-white hover:bg-[#8B6538]"
            }`}
          >
            Sign In
          </button>

          <div className="flex items-center my-4 sm:my-6">
            <div
              className={`flex-grow h-px ${
                darkMode ? "bg-gray-600" : "bg-gray-300"
              }`}
            ></div>
            <span
              className={`mx-2 sm:mx-4 text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              OR
            </span>
            <div
              className={`flex-grow h-px ${
                darkMode ? "bg-gray-600" : "bg-gray-300"
              }`}
            ></div>
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={`w-full flex items-center justify-center py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-300 text-sm sm:text-base ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FcGoogle className="text-xl sm:text-2xl mr-2 sm:mr-3" />
            Sign in with Google
          </button>

          <p
            className={`text-xs sm:text-sm text-center mt-4 sm:mt-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            New to ALCABAA?{" "}
            <a
              href="/signup"
              className={`hover:underline ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Sign up
            </a>
          </p>
        </form>
      </div>

      {/* Toast Container */}
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

export default Login;