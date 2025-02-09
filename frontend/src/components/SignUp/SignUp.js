import React, { useState, useContext, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaCheck, FaTimes } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { DarkModeContext } from "../../common/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { updateProfile, onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import auth from "../../config/firebase";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    noSpace: false,
    capital: false,
    number: false,
    specialChar: false,
  });

  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  // Check if user is logged in and redirect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Redirect to home page if the user is already logged in
        navigate("/");
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  const validatePassword = (value) => {
    const criteria = {
      length: value.length >= 6,
      noSpace: !/\s/.test(value),
      capital: /[A-Z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };
    setPasswordCriteria(criteria);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Extract user input
    const fullName = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Validate user input
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set the display name in the Firebase user profile
      await updateProfile(user, { displayName: fullName });

      // Extract and display a personalized welcome message
      const firstName = fullName.split(" ")[0];
      toast.success(`Welcome, ${firstName}! Account created successfully!`);

      // Redirect to login page
      navigate("/");
    } catch (error) {
      // Handle errors gracefully
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("User already exists!");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format!");
          break;
        case "auth/weak-password":
          toast.error("Password is too weak!");
          break;
        default:
          toast.error("An error occurred. Please try again!");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return (
    <div
      className={`flex p-4 items-center justify-center min-h-screen animate-fade-in transition-all duration-500 ${darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-800"
        }`}
    >
      <div
        className={`shadow-lg rounded-lg p-8 max-w-md w-full transition-all duration-500 ${darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200"
          }`}
      >
        <h2
          className={`text-3xl font-semibold text-center mb-8 ${darkMode ? "text-[#D4A373]" : "text-[#75351f]"
            }`}
        >
          Sign Up
        </h2>
        <form onSubmit={handleSignUp}>
          {/* Name Field */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-700"
                }`}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-gray-500"
                : "bg-white border-gray-300 focus:ring-blue-500"
                }`}
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-700"
                }`}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-gray-500"
                : "bg-white border-gray-300 focus:ring-blue-500"
                }`}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-700"
                }`}
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-gray-500"
                  : "bg-white border-gray-300 focus:ring-blue-500"
                  }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 flex items-center justify-center text-xl text-gray-500 hover:text-gray-700"
                style={{
                  height: "100%",
                }}
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
            {/* Password Criteria */}
            <ul className="mt-2 text-sm">
              <li className="flex items-center">
                {passwordCriteria.length ? (
                  <FaCheck className="text-green-500 mr-2" />
                ) : (
                  <FaTimes className="text-red-500 mr-2" />
                )}
                At least 6 characters
              </li>
              <li className="flex items-center">
                {passwordCriteria.noSpace ? (
                  <FaCheck className="text-green-500 mr-2" />
                ) : (
                  <FaTimes className="text-red-500 mr-2" />
                )}
                No spaces
              </li>
              <li className="flex items-center">
                {passwordCriteria.capital ? (
                  <FaCheck className="text-green-500 mr-2" />
                ) : (
                  <FaTimes className="text-red-500 mr-2" />
                )}
                At least one capital letter
              </li>
              <li className="flex items-center">
                {passwordCriteria.number ? (
                  <FaCheck className="text-green-500 mr-2" />
                ) : (
                  <FaTimes className="text-red-500 mr-2" />
                )}
                At least one number
              </li>
              <li className="flex items-center">
                {passwordCriteria.specialChar ? (
                  <FaCheck className="text-green-500 mr-2" />
                ) : (
                  <FaTimes className="text-red-500 mr-2" />
                )}
                At least one special character
              </li>
            </ul>
          </div>

          {/* Confirm Password */}
          <div className="mb-6 relative">
            <label
              htmlFor="confirmPassword"
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-700"
                }`}
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-gray-500"
                : "bg-white border-gray-300 focus:ring-blue-500"
                }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
            {confirmPassword && (
              <p className="mt-2 text-sm flex items-center">
                {password === confirmPassword ? (
                  <FaCheck className="text-green-500 mr-2" />
                ) : (
                  <FaTimes className="text-red-500 mr-2" />
                )}
                {password === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className={
              "w-full py-2 rounded-md shadow-md focus:outline-none focus:ring-2 bg-[#7A5733] text-white hover:bg-[#8B6538] focus:ring-slate-200"
            }
          >
            Sign Up
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span
              className={`mx-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}
            >
              OR
            </span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={`w-full flex items-center justify-center py-2 rounded-md shadow-md focus:outline-none focus:ring-2 ${darkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400"
              }`}
          >
            <FcGoogle className="text-2xl mr-3" />
            Continue with Google
          </button>

          {/* Login Redirect */}
          <p
            className={`text-sm text-center mt-6 ${darkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Already a user?{" "}
            <a
              href="/login"
              className={`${darkMode
                ? "text-blue-400 hover:underline"
                : "text-blue-600 hover:underline"
                }`}
            >
              Login
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

export default SignUp;