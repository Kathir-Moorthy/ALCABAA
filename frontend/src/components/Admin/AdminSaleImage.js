import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DarkModeContext } from "../../common/DarkModeContext";

const AdminSaleImage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const firebaseUID = process.env.REACT_APP_FIREBASE_UID;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { darkMode } = useContext(DarkModeContext);

  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.uid === firebaseUID) {
          setIsAuthorized(true);
        } else {
          navigate('/');
        }
      } else {
        navigate('/login');
        toast.warning('Please log in to access the admin page.', {
          position: 'top-center',
          autoClose: 3000,
          theme: darkMode ? 'dark' : 'light',
        });
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [auth, navigate, darkMode]);

  useEffect(() => {
    if (isAuthorized) {
      fetchImages();
    }
  }, [isAuthorized]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/images`);
      if (response.data && Array.isArray(response.data)) {
        setImages(response.data);
      }
    } catch {
    }
  };  
  
  const uploadImage = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/images/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data) {
        toast.success("Image uploaded successfully!");
        setFile(null);
        fileInputRef.current.value = "";
        fetchImages();
      } else {
        toast.error("Failed to upload image.");
      }
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };
  
  const deleteImage = async (id) => {
    setDeleting(id);
  
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/images/${id}`);
      toast.success("Image deleted successfully!");
      fetchImages();
    } catch {
      toast.error("Failed to delete image.");
    } finally {
      setDeleting(null);
    }
  };
  
  const updateOrder = async (updatedImages) => {
    try {
      const updates = updatedImages.map(({ _id, order }) => ({ id: _id, order }));
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/images/updateOrder`, { updates });
      toast.success("Order updated successfully!");
      fetchImages();
    } catch {
      toast.error("Failed to update order.");
    }
  };

  const handleOrderChange = (id, newOrder) => {
    const updatedImages = images.map((img) =>
      img._id === id ? { ...img, order: parseInt(newOrder, 10) || 0 } : img
    );
    setImages(updatedImages);
    updateOrder(updatedImages);
  };

  if (isCheckingAuth) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        Checking authentication...
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className={`p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <ToastContainer position="top-center" theme={darkMode ? "dark" : "light"} />
      <h1 className={`sm:text-2xl md:text-3xl font-bold p-2 ${darkMode ? "text-[#f5e0c3]" : "text-[#53381f]"}`}>Manage Sale Images</h1>
      <div className="my-4 flex items-center space-x-4">
        <div className={`relative ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"}`}>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className={`sm:text-md sm:rounded-md md:text-lg border ${darkMode ? "border-gray-700" : "border-gray-300"} rounded-lg px-4 py-2 flex items-center justify-center`}>
            {file ? file.name : "Choose File"}
          </div>
        </div>
        <button
          onClick={uploadImage}
          disabled={uploading}
          className={`sm:text-md sm:rounded-md md:text-lg px-4 py-2 rounded-lg ${
            uploading ? "bg-gray-400" : darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>
      <div className="mt-6 space-y-4">
        {images.map((image) => (
          <div
            key={image._id}
            className={`flex items-center justify-between ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"
            } p-4 rounded-lg shadow sm:p-2`}
          >
            <img src={image.url} alt="" className="w-24 h-24 object-cover rounded-lg sm:w-16 sm:h-16" />
            <input
              type="number"
              value={image.order}
              onChange={(e) => handleOrderChange(image._id, e.target.value)}
              className={`ml-4 border px-2 py-1 w-16 rounded-lg sm:w-12 ${
                darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-700"
              }`}
            />
            <button
              onClick={() => deleteImage(image._id)}
              disabled={deleting === image._id}
              className={`px-4 py-2 rounded-lg ${
                deleting === image._id
                  ? "bg-gray-400"
                  : darkMode
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-500 hover:bg-red-600"
              } text-white sm:px-3 sm:py-1`}
            >
              {deleting === image._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSaleImage;