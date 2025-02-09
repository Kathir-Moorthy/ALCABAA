import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DarkModeContext } from "../../common/DarkModeContext";
import AdminProductInput from "./AdminProductInput";
import AdminProductOutput from "./AdminProductOutput";

const AdminProduct = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const firebaseUID = process.env.REACT_APP_FIREBASE_UID;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { darkMode } = useContext(DarkModeContext);

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    category: "",
    subCategory: "",
    versions: [{ version: "", initialPrice: "", offerPrice: "", offerPercent: "" }],
    rating: "",
    reviews: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState("");

  const categories = {
    Mobile: ["Samsung", "Apple", "Google", "OnePlus", "Nothing"],
    Laptops: ["HP", "Dell", "Acer", "Lenovo", "Asus"],
    Clothing: ["Men", "Women"],
    Furniture: ["Table", "Chair", "Sofa", "Closet"],
    Groceries: ["Fruits", "Vegetables", "Nuts"],
    Kitchen: ["Plate", "Cup", "Knife", "Spoon"],
    Health: ["Medicine", "Tablet"],
    Books: ["Comics", "Novel"],
    Beauty: ["Men", "Women"],
    Gaming: ["Play Station", "XBox"],
    Cameras: ["Canon", "Nikon", "Sony", "Fujifilm", "DJI"],
    HomeAppliances: ["Fridge", "Washing Machine", "AC", "Boiler Heater"],
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.uid === firebaseUID) {
          setIsAuthorized(true);
          fetchProducts(); // Fetch products only if authorized
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
      setProducts(response.data);
    } catch {
    }
  };

  const handleSave = async () => {
    if (formData.rating > 5) {
      toast.error("Rating cannot exceed 5", {
        position: "top-center",
        autoClose: 3000,
        theme: darkMode ? "dark" : "light",
      });
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "versions") {
        formDataToSend.append(key, JSON.stringify(value));
      } else if (key === "image" && value) {
        formDataToSend.append(key, value);
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      if (isEditing) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/products/${editingProductId}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setIsEditing(false);
        setEditingProductId("");
        toast.success("Product updated successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: darkMode ? "dark" : "light",
        });
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/products/create`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Product added successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: darkMode ? "dark" : "light",
        });
      }
      fetchProducts();
      resetForm();
    } catch {
      toast.error("Failed to save product. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        theme: darkMode ? "dark" : "light",
      });
    }
  };

  const handleEdit = (product) => {
    setFormData({
      image: null,
      title: product.title,
      category: product.category,
      subCategory: product.subCategory,
      versions: product.versions,
      rating: product.rating,
      reviews: product.reviews,
      description: product.description,
    });
    setIsEditing(true);
    setEditingProductId(product._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`);
      fetchProducts();
      toast.success("Product deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: darkMode ? "dark" : "light",
      });
    } catch {
      toast.error("Failed to delete product.", {
        position: "top-center",
        autoClose: 3000,
        theme: darkMode ? "dark" : "light",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      image: null,
      title: "",
      category: "",
      subCategory: "",
      versions: [{ version: "", initialPrice: "", offerPrice: "", offerPercent: "" }],
      rating: "",
      reviews: "",
      description: "",
    });
    setIsEditing(false);
    setEditingProductId("");
  };

  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={`${i < fullStars ? "text-yellow-500" : "text-gray-300"} text-lg`}>
          ★
        </span>
      ));
    return stars;
  };

  if (isCheckingAuth) {
    return (
      <div
        className={`min-h-screen animate-fade-in flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
          }`}
      >
        Checking authentication...
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className={`p-8 min-h-screen animate-fade-in ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <ToastContainer position="top-center" theme={darkMode ? "dark" : "light"} />
      <h1 className="text-2xl font-bold mb-6">Admin Product Form</h1>
      <AdminProductInput
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        handleSave={handleSave}
        resetForm={resetForm}
        isEditing={isEditing}
        addVersion={() =>
          setFormData((prev) => ({
            ...prev,
            versions: [...prev.versions, { version: "", initialPrice: "", offerPrice: "", offerPercent: "" }],
          }))
        }
        removeVersion={(index) =>
          setFormData((prev) => ({
            ...prev,
            versions: prev.versions.filter((_, i) => i !== index),
          }))
        }
      />
      <AdminProductOutput
        products={products}
        renderStars={renderStars}
        formatNumber={formatNumber}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default AdminProduct;