import React, { useEffect, useContext, useState } from 'react';
import { FaCogs } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, deleteUser } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DarkModeContext } from '../../common/DarkModeContext';

const Settings = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const { darkMode } = useContext(DarkModeContext);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for popup modal

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsUserLoaded(true);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (isUserLoaded && !user) {
      toast.warning('You must be logged in to access the settings page.');
      navigate('/login');
    }
  }, [isUserLoaded, user, navigate]);

  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error('No user is currently signed in. Please sign in to delete your account.');
      return;
    }

    try {
      await deleteUser(user);
      toast.success('Your account has been permanently deleted. We hope to see you again!');
      navigate('/');
    } catch (error) {
      toast.error(
        `We encountered an issue while trying to delete your account: ${error.message}. ` +
        'Please ensure you are signed in and have recently reauthenticated before attempting again.'
      );
    } finally {
      setIsModalOpen(false); // Close modal after deletion attempt
    }
  };

  const handleChangePassword = () => {
    navigate('/forgotpassword');
  };

  return isUserLoaded ? (
    <div
      className={`flex justify-center items-center min-h-screen animate-fade-in ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
        }`}
    >
      <div
        className={`p-8 w-full max-w-lg rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
          }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center space-x-2">
          <FaCogs />
          <span>Account Settings</span>
        </h2>

        <p className="text-lg mb-8 text-center">
          Manage your account settings, such as changing your password or deleting your account.
        </p>

        {/* Delete Account Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsModalOpen(true)} // Open modal on click
            className={`w-full py-3 px-4 font-semibold rounded-lg transition duration-300 ${darkMode
              ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
              : 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400'
              } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
          >
            Delete Account Permanently
          </button>
          <p className={`text-sm mt-2 text-center font-semibold ${darkMode ? 'text-white' : 'text-red-500'}`}>
            Warning: This action cannot be undone, and all associated data will be permanently lost.
          </p>
        </div>

        {/* Change Password Button */}
        <div>
          <button
            onClick={handleChangePassword}
            className={`w-full py-3 px-4 font-semibold rounded-lg transition duration-300 ${darkMode
              ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
              : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400'
              } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
          >
            Change Password
          </button>
          <p className="text-sm mt-2 text-center">
            Update your password to enhance account security.
          </p>
        </div>
      </div>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-6 w-full max-w-md rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
              }`}
          >
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Confirm Account Deletion
            </h3>
            <p className="text-md text-center mb-6">
              Are you sure you want to permanently delete your account?
              <br /><br />
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-red-500'}`}>
                Warning : This action cannot be undone.
              </span>
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsModalOpen(false)} // Close modal on cancel
                className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null; // Show nothing while loading
};

export default Settings;