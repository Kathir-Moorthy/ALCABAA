import React, { useState, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhoneAlt, FaEnvelope, FaUser, FaCommentDots, FaBriefcase, FaBug, FaShoppingCart, FaHeadset } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { DarkModeContext } from "../../common/DarkModeContext";

const ContactUs = () => {
    const { darkMode } = useContext(DarkModeContext); // Use the DarkModeContext
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const nameValid = form.name.trim().length > 0;
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
        const phoneValid = /^[0-9]{10}$/.test(form.phone);
        const messageValid = form.message.trim().length > 0;

        if (!nameValid) {
            toast.error("Please enter a valid name.", {
                position: "top-right",
                theme: darkMode ? "dark" : "colored",
            });
            return false;
        }

        if (!emailValid) {
            toast.error("Please enter a valid email address.", {
                position: "top-right",
                theme: darkMode ? "dark" : "colored",
            });
            return false;
        }

        if (!phoneValid) {
            toast.error("Please enter a valid 10-digit phone number.", {
                position: "top-right",
                theme: darkMode ? "dark" : "colored",
            });
            return false;
        }

        if (!messageValid) {
            toast.error("Please enter a valid message.", {
                position: "top-right",
                theme: darkMode ? "dark" : "colored",
            });
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const firstName = form.name.split(" ")[0];
            toast.success(`Hi ${firstName}! We have received your message, we will get back to you shortly.`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: darkMode ? "dark" : "colored", 
                style: { backgroundColor: darkMode ? "#333" : "#795633", color: "#fff", fontSize: "16px", borderRadius: "8px" },
            });
            setForm({ name: "", email: "", phone: "", message: "" });
        }
    };

    return (
        <div className={`flex flex-col md:flex-row min-h-screen justify-center items-center p-6 gap-6 animate-fade-in ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            {/* Contact Form */}
            <form className={`w-full md:w-1/2 p-6 border rounded-lg shadow-md ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`} onSubmit={handleSubmit}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-[#795633]"}`}>
                    Contact Us
                </h2>
                <div className="mb-4">
                    <label className={`block font-medium flex items-center gap-2 ${darkMode ? "text-white" : "text-[#795633]"}`}>
                        <FaUser /> Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md focus:ring-2 outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500" : "bg-white border-gray-300 text-black focus:ring-[#795633]"}`}
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className={`block font-medium flex items-center gap-2 ${darkMode ? "text-white" : "text-[#795633]"}`}>
                        <MdOutlineEmail /> Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md focus:ring-2 outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500" : "bg-white border-gray-300 text-black focus:ring-[#795633]"}`}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className={`block font-medium flex items-center gap-2 ${darkMode ? "text-white" : "text-[#795633]"}`}>
                        <FaPhoneAlt /> Phone
                    </label>
                    <div className="flex items-center gap-2">
                        <span className={`font-bold ${darkMode ? "text-white" : "text-[#795633]"}`}>+91</span>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-2 outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500" : "bg-white border-gray-300 text-black focus:ring-[#795633]"}`}
                            placeholder="Enter phone number"
                            required
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className={`block font-medium flex items-center gap-2 ${darkMode ? "text-white" : "text-[#795633]"}`}>
                        <FaCommentDots /> Message
                    </label>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md focus:ring-2 outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500" : "bg-white border-gray-300 text-black focus:ring-[#795633]"}`}
                        placeholder="Enter your message"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full py-2 rounded-md transition ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-[#795633] text-white hover:bg-opacity-90"}`}
                >
                    Send
                </button>
            </form>

            {/* Contact Details Card */}
            <div className={`w-full md:w-1/3 p-6 border rounded-lg shadow-md ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-[#795633]"}`}>
                    Get in Touch
                </h2>
                <div className="space-y-4">
                    {[
                        { title: "Careers", icon: <FaBriefcase />, phone: "+91 98765 43210", email: "careers@alcabaa.com" },
                        { title: "Bug Issues", icon: <FaBug />, phone: "+91 87654 32109", email: "bugs@alcabaa.com" },
                        { title: "Order Enquiry", icon: <FaShoppingCart />, phone: "+91 76543 21098", email: "orders@alcabaa.com" },
                        { title: "Customer Care", icon: <FaHeadset />, phone: "+91 65432 10987", email: "support@alcabaa.com" },
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col gap-2 border-b-2 pb-2">
                            <p className={`font-bold text-lg flex items-center gap-2 ${darkMode ? "text-white" : "text-[#795633]"}`}>
                                {item.icon} {item.title}
                            </p>
                            <p className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                <FaPhoneAlt className="text-sm" /> {item.phone}
                            </p>
                            <p className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                <FaEnvelope className="text-sm" /> {item.email}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Toast Notification */}
            <ToastContainer />
        </div>
    );
};

export default ContactUs;