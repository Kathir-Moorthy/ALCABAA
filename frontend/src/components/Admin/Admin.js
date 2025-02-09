import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaBox } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { DarkModeContext } from '../../common/DarkModeContext';

const Admin = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const firebaseUID = process.env.REACT_APP_FIREBASE_UID;

  const [isAuthorized, setIsAuthorized] = useState(false); // Tracks if user is authorized
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Tracks if auth check is in progress
  const { darkMode } = useContext(DarkModeContext); // Access dark mode state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.uid === firebaseUID) {
          setIsAuthorized(true);
        } else {
          // Navigate first, then show alert
          navigate('/');
        }
      } 
      else {
        // Navigate first, then show alert
        navigate('/login');
        toast.warning('Please log in to access the admin page.', {
          position: 'top-center',
          autoClose: 3000,
          theme: darkMode ? 'dark' : 'light', // Dynamically set Toastify theme
        });
      }
      setIsCheckingAuth(false); // Auth check is complete
    });

    return () => unsubscribe(); // Cleanup listener to prevent memory leaks
  }, [auth, navigate, darkMode]);

  // Show nothing or a loader while checking authentication
  if (isCheckingAuth) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
        }`}
      >
        Checking authentication...
      </div>
    );
  }

  // If not authorized, prevent rendering the component (handled by navigation above)
  if (!isAuthorized) return null;

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-8 animate-fade-in ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      }`}
    >
      {/* Toast Notification Container */}
      <ToastContainer theme={darkMode ? 'dark' : 'light'} />
      <h1 className="text-3xl font-bold mb-8">Admin Access</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-11/12 max-w-4xl">
        {/* Sale Image Card */}
        <div
          onClick={() => navigate('/saleimageadmin')}
          className={`shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          }`}
        >
          <FaImage className={`text-6xl mb-4 ${darkMode ? 'text-gray-300' : 'text-[#835c35]'}`} />
          <h2 className="text-xl font-semibold">Sale Image</h2>
        </div>

        {/* Products Card */}
        <div
          onClick={() => navigate('/productadmin')}
          className={`shadow-md rounded-lg p-6 flex items-center justify-center flex-col cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          }`}
        >
          <FaBox className={`text-6xl mb-4 ${darkMode ? 'text-gray-300' : 'text-[#835c35]'}`} />
          <h2 className="text-xl font-semibold">Products</h2>
        </div>
      </div>
    </div>
  );
};

export default Admin;