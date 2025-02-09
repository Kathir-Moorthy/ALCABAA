import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import auth, { firestore } from "../../config/firebase";
import { DarkModeContext } from "../../common/DarkModeContext";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState([
    { addressLine: "", landmark: "", state: "", city: "", pincode: "" },
    { addressLine: "", landmark: "", state: "", city: "", pincode: "" },
  ]); // Default to two empty addresses
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);

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
            setPhone(data.phone || "");
            setAddresses(data.addresses || [
              { addressLine: "", landmark: "", state: "", city: "", pincode: "" },
              { addressLine: "", landmark: "", state: "", city: "", pincode: "" },
            ]);
          } else {
            setPhone("");
          }
        } catch {
          toast.error("Failed to load profile data.");
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("You need to log in to view your profile.");
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const validatePhone = () => {
    const isValid = /^[0-9]{10}$/.test(phone);
    if (!isValid) {
      toast.error("Enter a valid 10-digit phone number.");
    }
    return isValid;
  };

  const validateAddresses = () => {
    for (const address of addresses) {
      if (!address.addressLine.trim() || !address.city.trim() || !address.state.trim() || !address.pincode.trim()) {
        toast.error("All address fields are required.");
        return false;
      }
      if (!/^[0-9]{6}$/.test(address.pincode)) {
        toast.error("Pincode must be exactly 6 digits.");
        return false;
      }
    }

    return true;
  };

  const handleSaveProfile = async () => {
    if (!validatePhone() || !validateAddresses()) {
      return;
    }

    try {
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, { phone, addresses });
      setEditMode(false);
      toast.success("Profile saved successfully.");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleAddAddress = () => {
    if (addresses.length >= 3) {
      toast.error("You can add up to 3 addresses only.");
      return;
    }

    setAddresses([
      ...addresses,
      { addressLine: "", landmark: "", state: "", city: "", pincode: "" },
    ]);
    toast.success("Address added.");
  };

  const handleRemoveAddress = (index) => {
    if (addresses.length <= 2) {
      toast.error("You must have at least one alternate address.");
      return;
    }

    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
    toast.success("Address removed successfully.");
  };

  if (!user) return null;

  // Dynamic styles for light/dark mode
  const containerStyles = darkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-white text-gray-900";
  const labelStyles = darkMode ? "text-gray-300" : "text-gray-700";
  const inputStyles = darkMode
    ? "bg-gray-800 border-gray-700 text-gray-100"
    : "bg-gray-100 border-gray-300 text-gray-900";
  const buttonStyles = darkMode
    ? "bg-blue-600 hover:bg-blue-500 text-white"
    : "bg-blue-500 hover:bg-blue-400 text-white";
  const removeButtonStyles = darkMode
    ? "bg-red-600 hover:bg-red-500 text-white"
    : "bg-red-500 hover:bg-red-400 text-white";
  const loadingTextStyles = darkMode ? "text-gray-300" : "text-gray-800";

  return (
    <div
      className={`p-6 max-w-4xl min-h-screen animate-fade-in mx-auto shadow-md rounded-md ${containerStyles}`}
    >
      <ToastContainer
        theme={darkMode ? "dark" : "light"}
        position="top-center"
        autoClose={3000}
      />
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      {loading ? (
        <p className={`text-center ${loadingTextStyles}`}>Loading...</p>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className={`block font-medium ${labelStyles}`}>Name</label>
              <p
                className={`text-lg ${
                  darkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                {user.displayName || "N/A"}
              </p>
            </div>
            <div>
              <label className={`block font-medium ${labelStyles}`}>Email</label>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {user.email}
              </p>
            </div>
          </div>

          <div>
            <label className={`block mb-1 font-medium ${labelStyles}`}>
              Phone (India +91)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!editMode}
              onBlur={validatePhone}
              className={`w-full p-2 border rounded-md ${
                editMode ? "border-gray-300" : inputStyles
              } ${darkMode ? "bg-gray-800 text-gray-100" : "text-gray-900"}`}
            />
          </div>

          <div className="mt-4">
            <label className={`block mb-1 font-medium ${labelStyles}`}>
              Addresses
            </label>
            {addresses.map((address, i) => (
              <div key={i} className="mb-4 p-4 border rounded-md">
                <div className="mb-2">
                  <label className={`block font-medium ${labelStyles}`}>
                    Address Line
                  </label>
                  <input
                    type="text"
                    value={address.addressLine}
                    onChange={(e) => {
                      const newAddresses = [...addresses];
                      newAddresses[i].addressLine = e.target.value;
                      setAddresses(newAddresses);
                    }}
                    disabled={!editMode}
                    className={`w-full p-2 border rounded-md ${inputStyles}`}
                  />
                </div>
                <div className="mb-2">
                  <label className={`block font-medium ${labelStyles}`}>
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => {
                      const newAddresses = [...addresses];
                      newAddresses[i].landmark = e.target.value;
                      setAddresses(newAddresses);
                    }}
                    disabled={!editMode}
                    className={`w-full p-2 border rounded-md ${inputStyles}`}
                  />
                </div>
                <div className="mb-2">
                  <label className={`block font-medium ${labelStyles}`}>
                    State
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => {
                      const newAddresses = [...addresses];
                      newAddresses[i].state = e.target.value;
                      setAddresses(newAddresses);
                    }}
                    disabled={!editMode}
                    className={`w-full p-2 border rounded-md ${inputStyles}`}
                  />
                </div>
                <div className="mb-2">
                  <label className={`block font-medium ${labelStyles}`}>
                    City
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => {
                      const newAddresses = [...addresses];
                      newAddresses[i].city = e.target.value;
                      setAddresses(newAddresses);
                    }}
                    disabled={!editMode}
                    className={`w-full p-2 border rounded-md ${inputStyles}`}
                  />
                </div>
                <div>
                  <label className={`block font-medium ${labelStyles}`}>
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => {
                      const newAddresses = [...addresses];
                      newAddresses[i].pincode = e.target.value;
                      setAddresses(newAddresses);
                    }}
                    disabled={!editMode}
                    className={`                    w-full p-2 border rounded-md ${inputStyles}`}
                  />
                </div>
                {editMode && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(i)}
                    className={`mt-2 px-3 py-1 rounded-md ${removeButtonStyles}`}
                  >
                    Remove Address
                  </button>
                )}
              </div>
            ))}
            {editMode && (
              <button
                type="button"
                onClick={handleAddAddress}
                className={`mt-4 px-4 py-2 rounded-md ${buttonStyles}`}
              >
                Add Address
              </button>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className={`px-4 py-2 rounded-md ${buttonStyles}`}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveProfile}
                  className={`px-4 py-2 rounded-md ${buttonStyles}`}
                >
                  Save Profile
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className={`px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-400 text-white`}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;