import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc } from "firebase/firestore";
import auth, { firestore } from "../../config/firebase";
import { DarkModeContext } from "../../common/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaypal,
  faGooglePay,
  faApplePay,
  faAmazonPay,
} from "@fortawesome/free-brands-svg-icons";
import QR from '../../assets/QR/QR.png';
import { FaArrowRight } from "react-icons/fa";

const Checkout = () => {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [selectedUPI, setSelectedUPI] = useState(null); // Track selected UPI app
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    if (location.state?.cart) {
      setCart(location.state.cart);
    } else {
      setCart(null);
    }
  }, [location]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(true);
        try {
          const docRef = doc(firestore, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const formattedAddresses = (data.addresses || []).map((address) => {
              return `${address.addressLine || ""}, ${address.landmark || ""}, ${address.city || ""}, ${address.state || ""}, ${address.pincode || ""}`.trim();
            });

            if (data.alternateAddress) {
              formattedAddresses.push(
                `${data.alternateAddress.addressLine || ""}, ${data.alternateAddress.landmark || ""
                  }, ${data.alternateAddress.city || ""}, ${data.alternateAddress.state || ""
                  }, ${data.alternateAddress.zip || ""}`.trim()
              );
            }

            setPhone(data.phone || "");
            setAddresses(formattedAddresses);
            setSelectedAddress(formattedAddresses[0] || "");
          } else {
            setPhone("");
            setAddresses([]);
            setSelectedAddress("");
          }
        } catch {
          toast.error("Failed to load checkout data.");
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setCart(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handlePaymentMethodChange = (method) => {
    if (paymentMethod === method) {
      // If the same method is clicked again, deselect it
      setPaymentMethod("");
      setShowQR(false);
      setSelectedUPI(null);
    } else {
      // Otherwise, select the new method
      setPaymentMethod(method);
      setShowQR(false); // Reset QR code visibility when changing payment method
      setSelectedUPI(null); // Reset selected UPI app
    }
  };

  const handleConfirmOrder = () => {
    // Check if phone or delivery address is missing
    if (!phone || addresses.length === 0) {
      toast.error("Profile incomplete. Please update your phone number and delivery address.", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => navigate("/profile"), // Navigate to profile page after toast closes
      });
      return; // Exit the function early if validation fails
    }
  
    // If validation passes, proceed with the order confirmation
    toast.success("ALCABAA is just a demo website so enjoy learning the platform");
    setCart(null);
    setPaymentMethod("");
    setShowQR(false);
  };

  const handleCancelOrder = () => {
    setCart(null);
    setPaymentMethod("");
    setShowQR(false);
  };

  const shippingFee = cart ? (cart.totalCost < 1000 ? 50 : 0) : 0;
  const platformFee = 20;
  const totalAmount = cart ? cart.totalCost + shippingFee + platformFee : 0;

  // Calculate estimated delivery date (third day from today)
  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    return deliveryDate.toDateString();
  };

  const deliveryDate = getDeliveryDate();

  const containerStyles = darkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-white text-gray-900";
  const labelStyles = darkMode ? "text-gray-300" : "text-gray-700";
  const inputStyles = darkMode
    ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
    : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500";
  const buttonStyles = darkMode
    ? "bg-blue-600 hover:bg-blue-500 text-white"
    : "bg-blue-500 hover:bg-blue-400 text-white";
  const loadingTextStyles = darkMode ? "text-gray-300" : "text-gray-800";

  if (!user) {
    return (
      <div className={`p-8 min-h-screen animate-fade-in transition-all duration-500 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
        <ToastContainer
          theme={darkMode ? "dark" : "light"}
          position="top-center"
          autoClose={3000}
        />
        <h1 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-[#F4EDE3]" : "text-[#6C4B2F]"}`}>
          Checkout
        </h1>
        <div className="text-center flex flex-col items-center justify-center mt-12">
          <p className={`text-lg font-medium ${darkMode ? "text-[#F4EDE3]" : "text-[#976b41]"}`}>
            Please Login To Avail Checkout
          </p>
          <button
            onClick={() => navigate("/login")}
            className={`mt-4 w-48 py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center ${darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-[#855f3b] text-white hover:bg-[#c78451]"
              }`}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className={`p-8 min-h-screen animate-fade-in transition-all duration-500 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
        <ToastContainer
          theme={darkMode ? "dark" : "light"}
          position="top-center"
          autoClose={3000}
        />
        <h1 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-[#F4EDE3]" : "text-[#6C4B2F]"}`}>
          Checkout
        </h1>
        <div className="text-center flex flex-col items-center justify-center mt-12">
          <p className={`text-lg font-medium ${darkMode ? "text-[#F4EDE3]" : "text-[#976b41]"}`}>
            No products are there in checkout. Purchase some products.
          </p>
          <button
            onClick={() => navigate("/products")}
            className={`mt-4 w-48 py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center ${darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-[#855f3b] text-white hover:bg-[#c78451]"
              }`}
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-8 min-h-screen animate-fade-in transition-all duration-500 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      <ToastContainer
        theme={darkMode ? "dark" : "light"}
        position="top-center"
        autoClose={3000}
      />
      <h1 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-[#F4EDE3]" : "text-[#6C4B2F]"}`}>
        Checkout
      </h1>
      {loading ? (
        <div className="text-center flex flex-col items-center justify-center mt-12">
          <p className={`text-lg font-medium ${darkMode ? "text-[#F4EDE3]" : "text-[#976b41]"}`}>
            Loading...
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div
            className={`rounded-2xl overflow-hidden transition-all duration-300 ${darkMode ? "bg-gray-800 shadow-xl shadow-gray-700" : "bg-white shadow-lg"
              }`}
          >
            <div className="p-6">
              {/* User Details Section */}
              <div className="flex flex-col ml-5 gap-6 mb-6">
                <div>
                  <label className={`block text-lg font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Name
                  </label>
                  <p className={`text-xl font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {user.displayName || "N/A"}
                  </p>
                </div>

                <div>
                  <label className={`block text-lg font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Phone
                  </label>
                  <p className={`text-lg font-medium ${darkMode ? "text-gray-400" : "text-gray-800"}`}>
                    {phone}
                  </p>
                </div>

                {/* Address Dropdown */}
                <div className="mt-4">
                  <label className={`block text-lg font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Delivery Address
                  </label>
                  <select
                    value={selectedAddress}
                    onChange={handleAddressChange}
                    className={`w-full p-3 border rounded-lg font-medium transition-all duration-300 outline-none focus:ring-2 ${darkMode
                      ? "bg-gray-700 text-gray-300 border-gray-600 focus:ring-green-500"
                      : "bg-gray-100 text-gray-800 border-gray-300 focus:ring-blue-500"
                      }`}
                  >
                    {addresses.map((address, i) => (
                      <option key={i} value={address} className="text-lg">
                        {address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 p-6 bg-white dark:bg-[#2A2A2A] rounded-2xl shadow-md">
                <h2 className={`text-2xl font-semibold border-b pb-3 ${darkMode ? "text-[#F4EDE3] border-gray-600" : "text-[#6C4B2F] border-gray-300"}`}>
                  Order Summary
                </h2>

                <div className="mt-4 text-lg">
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} flex justify-between font-semibold`}>
                    <span>Subtotal:</span> <span>₹{cart.totalCost}</span>
                  </p>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} flex justify-between font-semibold`}>
                    <span>Shipping:</span>
                    <span>₹{shippingFee} {shippingFee === 0 ? <span className="text-green-500"> (FREE Delivery on orders above ₹1,000)</span> : ""}</span>
                  </p>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-700 font-semibold"} flex justify-between`}>
                    <span>Platform Fee:</span> <span>₹{platformFee}</span>
                  </p>
                </div>

                <div className="mt-4 border-t pt-3 flex justify-between font-bold text-xl">
                  <span className={`${darkMode ? "text-[#F4EDE3]" : "text-[#6C4B2F]"}`}>Total Amount:</span>
                  <span className={`${darkMode ? "text-[#F4EDE3]" : "text-[#6C4B2F]"}`}>₹{totalAmount}</span>
                </div>

                <p className={`mt-3 font-medium ${darkMode ? "text-blue-300" : "text-[#4e331c]"}`}>
                  Estimated Delivery: <span className="font-semibold">{deliveryDate} 11:30 AM</span>
                </p>
              </div>

              <div className="mt-6 p-6 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className={`text-2xl font-semibold pb-4 border-b ${darkMode ? "text-[#F4EDE3] border-gray-600" : "text-[#6C4B2F] border-gray-300"}`}>
                  Payment Options
                </h2>

                <div className="mt-5 flex gap-4">
                  <button
                    onClick={() => handlePaymentMethodChange("cod")}
                    className={`w-1/2 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md ${paymentMethod === "cod"
                        ? "bg-green-600 text-white ring-2 ring-green-500"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                  >
                    Cash on Delivery (COD)
                  </button>
                  <button
                    onClick={() => handlePaymentMethodChange("upi")}
                    className={`w-1/2 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md ${paymentMethod === "upi"
                        ? "bg-green-600 text-white ring-2 ring-green-500"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                  >
                    UPI
                  </button>
                </div>

                {paymentMethod === "upi" && (
                  <div className="mt-6">
                    <h3 className={`text-lg font-semibold mb-3 ${darkMode ? "text-[#F4EDE3]" : "text-[#6C4B2F]"}`}>
                      Choose UPI App:
                    </h3>
                    <div className="flex gap-4">
                      {[
                        { icon: faPaypal, color: "#003087" },
                        { icon: faGooglePay, color: "#4285F4" },
                        { icon: faApplePay, color: "#000000" },
                        { icon: faAmazonPay, color: "#FF9900" },
                      ].map((app, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedUPI(index);
                            setShowQR(true);
                          }}
                          className={`p-5 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 ${selectedUPI === index ? "ring-4 ring-offset-2" : ""
                            }`}
                          style={{
                            backgroundColor: selectedUPI === index ? app.color : darkMode ? "#374151" : "#F3F4F6",
                            color: selectedUPI === index ? "#FFFFFF" : darkMode ? "#D1D5DB" : "#4B5563",
                          }}
                        >
                          <FontAwesomeIcon icon={app.icon} className="text-3xl" />
                        </button>
                      ))}
                    </div>

                    {showQR && (
                      <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg text-center animate-fade-in">
                        <img src={QR} alt="UPI QR Code" className="w-48 h-48 mx-auto rounded-lg shadow-md" />
                        <p className="mt-3 text-white font-bold text-lg">Scan to Pay</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Actions */}
              <div className="mt-6 flex gap-4">
                {paymentMethod && (
                  <button
                    onClick={handleConfirmOrder}
                    className="px-6 py-3 rounded-lg font-semibold flex items-center justify-center shadow-lg transition-all duration-300 bg-gradient-to-r from-[#855f3b] to-[#c78451] text-white hover:shadow-xl hover:scale-105"
                  >
                    Confirm and Place Order <FaArrowRight className="ml-2" />
                  </button>
                )}
                <button
                  onClick={handleCancelOrder}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center shadow-md transition-all duration-300 ${paymentMethod
                    ? "bg-red-100 text-red-600 hover:bg-red-200 w-1/2"
                    : "bg-red-100 text-red-600 hover:bg-red-200 w-auto px-4"
                    }`}
                >
                  Clear Check Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;