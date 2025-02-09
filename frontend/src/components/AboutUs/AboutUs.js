import React, { useContext } from "react";
import Ab from '../../assets/Aboutus/Abt.jpg';
import { DarkModeContext } from "../../common/DarkModeContext";

const AboutUs = () => {
  const { darkMode } = useContext(DarkModeContext); // Access dark mode state

  return (
    <section
      className={`py-12 px-4 min-h-screen animate-fade-in ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
      id="aboutus"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-6">
        {/* Left Side Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={Ab}
            alt="About ALCABAA"
            className="w-full h-auto max-w-sm object-cover rounded-md shadow-lg"
          />
        </div>

        {/* Right Side Content */}
        <div className="flex-1">
          <h2
            className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 ${
              darkMode ? "text-yellow-300" : "text-[#785532]"
            }`}
          >
            About Us
          </h2>
          <p
            className={`text-sm text-justify md:text-lg leading-relaxed mb-3 md:mb-4 ${
              darkMode ? "text-gray-300" : "text-[#785532]"
            }`}
          >
            Welcome to <span className="font-bold">ALCABAA</span> – where style
            meets substance. Our brand is built on the pillars of Balance,
            Authenticity, and Ambition, aiming to redefine lifestyle collections
            with a unique blend of modern aesthetics and timeless elegance.
          </p>
          <p
            className={`text-sm text-justify md:text-lg leading-relaxed mb-3 md:mb-4 ${
              darkMode ? "text-gray-300" : "text-[#523e24]"
            }`}
          >
            At ALCABAA, we curate products that not only enhance your daily
            living but also resonate with your aspirations and individuality.
            From chic apparel to functional home decor, every item is a
            testament to our commitment to quality, sustainability, and
            innovation.
          </p>
          <p
            className={`text-sm text-justify md:text-lg leading-relaxed mb-3 md:mb-4 ${
              darkMode ? "text-gray-300" : "text-[#7a6c58]"
            }`}
          >
            Our mission is to empower individuals to express themselves through
            thoughtfully designed products that inspire confidence and
            creativity. We believe in creating a harmonious balance between
            style and purpose, ensuring our collections cater to the diverse
            needs of our global community.
          </p>
          <p
            className={`text-sm text-justify md:text-lg leading-relaxed ${
              darkMode ? "text-gray-300" : "text-[#523e24]"
            }`}
          >
            Join us on this journey to celebrate authenticity and ambition. Let
            ALCABAA be your partner in creating a lifestyle that's uniquely
            yours.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 md:mt-16">
        <h2
          className={`text-2xl md:text-3xl font-bold mb-6 text-center ${
            darkMode ? "text-yellow-300" : "text-[#785532]"
          }`}
        >
          FAQs
        </h2>
        <div className="max-w-2xl mx-auto">
          <details
            className={`mb-3 md:mb-4 border rounded-lg shadow-sm overflow-hidden ${
              darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-200"
            }`}
          >
            <summary
              className={`cursor-pointer px-3 py-2 text-sm md:text-lg font-medium ${
                darkMode ? "text-yellow-300" : "text-[#785532]"
              }`}
            >
              What is ALCABAA?
            </summary>
            <p
              className={`px-4 py-2 leading-relaxed text-sm md:text-base ${
                darkMode ? "text-gray-300" : "text-[#523e24]"
              }`}
            >
              ALCABAA stands for A Lifestyle Collection, Adorned with Balance,
              Authenticity, and Ambition. It is a brand dedicated to providing
              high-quality lifestyle products that combine modern aesthetics with
              timeless elegance.
            </p>
          </details>
          <details
            className={`mb-3 md:mb-4 border rounded-lg shadow-sm overflow-hidden ${
              darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-200"
            }`}
          >
            <summary
              className={`cursor-pointer px-3 py-2 text-sm md:text-lg font-medium ${
                darkMode ? "text-yellow-300" : "text-[#785532]"
              }`}
            >
              What types of products do you offer?
            </summary>
            <p
              className={`px-4 py-2 leading-relaxed text-sm md:text-base ${
                darkMode ? "text-gray-400" : "text-[#7a6c58]"
              }`}
            >
              We offer a wide range of products, including chic apparel,
              functional home decor, and other lifestyle items designed to meet
              the diverse needs of our customers.
            </p>
          </details>
          <details
            className={`mb-3 md:mb-4 border rounded-lg shadow-sm overflow-hidden ${
              darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-200"
            }`}
          >
            <summary
              className={`cursor-pointer px-3 py-2 text-sm md:text-lg font-medium ${
                darkMode ? "text-yellow-300" : "text-[#785532]"
              }`}
            >
              How do you ensure product quality?
            </summary>
            <p
              className={`px-4 py-2 leading-relaxed text-sm md:text-base ${
                darkMode ? "text-gray-300" : "text-[#523e24]"
              }`}
            >
              At ALCABAA, we are committed to quality and sustainability. Every
              product undergoes strict quality checks to ensure it meets our high
              standards before reaching our customers.
            </p>
          </details>
          <details
            className={`mb-3 md:mb-4 border rounded-lg shadow-sm overflow-hidden ${
              darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-200"
            }`}
          >
            <summary
              className={`cursor-pointer px-3 py-2 text-sm md:text-lg font-medium ${
                darkMode ? "text-yellow-300" : "text-[#785532]"
              }`}
            >
              How can I contact your support team?
            </summary>
            <p
              className={`px-4 py-2 leading-relaxed text-sm md:text-base ${
                darkMode ? "text-gray-400" : "text-[#7a6c58]"
              }`}
            >
              You can contact our support team via the Contact Us section on our
              website. We are dedicated to providing prompt and effective
              assistance to all customer inquiries.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;