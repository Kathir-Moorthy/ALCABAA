import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import auth from "../../config/firebase";
import { FaTrashAlt, FaShoppingCart, FaArrowRight } from "react-icons/fa";
import { DarkModeContext } from "../../common/DarkModeContext";

const Cart = () => {
  const [cart, setCart] = useState({ items: [], totalCost: 0 });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${user.uid}`);
        setCart(response.data);
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const handleQuantityChange = async (productId, version, quantity) => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cart/update-quantity`, {
      userId: user.uid,
      productId,
      version,
      quantity,
    });
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${user.uid}`);
    setCart(response.data);
  };

  const handleRemove = async (productId, version) => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cart/remove`, {
      userId: user.uid,
      productId,
      version,
    });
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${user.uid}`);
    setCart(response.data);
  };

  const handleCheckout = () => {
    // Pass cart data to Checkout component
    navigate("/checkout", { state: { cart } });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleGoToProducts = () => {
    navigate("/products");
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div
      className={`p-8 min-h-screen transition-all duration-500 animate-fade-in ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <h1
        className={`text-3xl font-bold mb-8 text-center ${
          darkMode ? "text-[#F4EDE3]" : "text-[#6C4B2F]"
        }`}
      >
        Your Cart
      </h1>
      {!loading && !user ? (
        <div className="text-center flex flex-col items-center justify-center mt-12">
          <p className={`text-lg font-medium ${darkMode ? "text-[#F4EDE3]" : "text-[#976b41]"}`}>
            Please Login To Avail Cart
          </p>
          <button
            onClick={handleLogin}
            className={`mt-4 w-48 py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center ${
              darkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-[#855f3b] text-white hover:bg-[#c78451]"
            }`}
          >
            Login
          </button>
        </div>
      ) : loading ? (
        <div className="text-center flex flex-col items-center justify-center mt-12">
          <p className={`text-lg font-medium ${darkMode ? "text-[#F4EDE3]" : "text-[#976b41]"}`}>
            Loading...
          </p>
        </div>
      ) : cart.items.length === 0 ? (
        <div className="text-center flex flex-col items-center justify-center mt-12">
          <FaShoppingCart
            className={`text-6xl mb-4 ${darkMode ? "text-[#F4EDE3]" : "text-[#9e7146]"}`}
          />
          <p className={`text-lg font-medium ${darkMode ? "text-[#F4EDE3]" : "text-[#976b41]"}`}>
            Oops! Your cart is empty.
          </p>
          <p className={`text-sm ${darkMode ? "text-[#F4EDE3]" : "text-[#976b41]"}`}>
            Browse our products and add items to your cart!
          </p>
          <button
            onClick={handleGoToProducts}
            className={`mt-4 w-48 py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center ${
              darkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-[#855f3b] text-white hover:bg-[#c78451]"
            }`}
          >
            Go to Products
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div
            className={`rounded-lg overflow-hidden ${
              darkMode ? "bg-gray-800 shadow-gray-700" : "bg-white shadow-lg"
            }`}
          >
            {cart.items.map((item) => (
              <div
                key={`${item.productId}-${item.version}`}
                className={`p-6 border-b last:border-b-0 flex flex-col md:flex-row items-center justify-between transition duration-200`}
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-24 object-cover rounded-lg shadow-sm"
                  />
                  <div className="ml-4">
                    <h2
                      className={`text-xl font-semibold ${
                        darkMode ? "text-[#F4EDE3]" : "text-[#8e5f39]"
                      }`}
                    >
                      {item.title}
                    </h2>
                    <p
                      className={`font-medium text-sm ${
                        darkMode ? "text-[#F4EDE3]" : "text-[#99673e]"
                      }`}
                    >
                      Version: {item.version}
                    </p>
                    <p
                      className={`font-medium text-sm ${
                        darkMode ? "text-[#F4EDE3]" : "text-[#99673e]"
                      }`}
                    >
                      Price: ₹{formatNumber(item.offerPrice)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.version, item.quantity - 1)
                      }
                      className={`px-3 py-1 rounded-lg transition duration-200 ${
                        darkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      -
                    </button>
                    <span
                      className={`mx-4 text-lg ${
                        darkMode ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.version, item.quantity + 1)
                      }
                      className={`px-3 py-1 rounded-lg transition duration-200 ${
                        darkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.productId, item.version)}
                    className={`ml-6 p-2 rounded-lg transition duration-200 flex items-center ${
                      darkMode
                        ? "bg-red-700 text-red-200 hover:bg-red-600"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                  >
                    <FaTrashAlt className="mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div
            className={`mt-6 p-6 rounded-lg ${
              darkMode ? "bg-gray-800 shadow-gray-700" : "bg-white shadow-lg"
            }`}
          >
            <p
              className={`text-xl font-semibold ${
                darkMode ? "text-[#F4EDE3]" : "text-[#6C4B2F]"
              }`}
            >
              Total Cost: ₹{formatNumber(cart.totalCost)}
            </p>
            <button
              onClick={handleCheckout}
              className={`mt-4 w-50 py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center mx-auto ${
                darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-[#855f3b] text-white hover:bg-[#c78451]"
              }`}
            >
              Proceed to Checkout <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;