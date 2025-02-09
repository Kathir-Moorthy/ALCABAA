# 🌐ALCABAA - MERN Stack Ecommerce Website 

## 🚀 Introduction
ALCABAA is a fully responsive **MERN Stack Ecommerce Website** that offers seamless shopping experiences with modern UI/UX. The website supports user authentication, product filtering, cart management, admin controls, and secure checkout using QR-based UPI payments. 

---

## 🛠 Tech Stack

### Frontend
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
- ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
- ![React](https://img.shields.io/badge/ReactJS-61DAFB?style=for-the-badge&logo=react&logoColor=black)

### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

### Database
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
- Cloudinary (for image hosting)

### Authentication
- ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

---

## 📁 Project Structure

### Frontend
```
  ├── public/
  │   ├── index.html              # Main HTML file
  │   └── logo.png                # Logo image 
  ├── src/
  │   ├── assets/
  │   │   ├── Aboutus               
  │   │   │   └──Abt.jpg          # About us section image
  │   │   └── QR
  │   │       └── QR.png          # QR Code for UPI payments
  │   ├── common/
  │   │   ├── DarkModeContext.js  # Dark mode context provider 
  │   │   ├── Footer.js           # Website footer
  │   │   ├── MenuBar.js          # Navigation menu bar
  │   │   ├── Navbar.js           # Website navbar
  │   │   ├── SearchBar.js        # Search bar component
  │   │   └── SideMenu.js         # Side menu navigation
  │   ├── components/
  │   │   ├── AboutUs/            # About Us page components 
  │   │   ├── Admin/              # Admin dashboard components
  │   │   ├── Cart/               # Shopping cart components
  │   │   ├── Checkout/           # Checkout page components
  │   │   ├── ContactUs/          # Contact us form
  │   │   ├── Home/               # Homepage components
  │   │   ├── Login/              # Login page components
  │   │   ├── Products/           # Product listing page
  │   │   ├── Profile/            # User profile page 
  │   │   ├── Settings/           # User settings page
  │   │   └── SignUp/             # Signup page components
  │   ├── config/
  │   │   └── firebase.js         # Firebase configuration for Authentication
  │   ├── App.js                  # Main React app component with app routes
  │   ├── index.css               # Global styles 
  │   └── index.js                # Entry point for React
  ├── .gitignore
  ├── package-lock.json
  ├── package.json
  └── tailwind.config.js
```

### Backend
```
  ├──config/
  │  ├── cloudinary.js             # Cloudinary setup for image uploads 
  │  └── multer.js                 # Multer setup for handling file uploads
  ├── controllers/
  │   ├── cartController.js        # Handles cart functionalities
  │   ├── imageController.js       # Handles image uploads and retrieval
  │   └── productController.js     # Handles product operations
  ├── models/                      
  │   ├── Cart.js                  # Schema for cart items
  │   ├── Product.js               # Schema for products 
  │   └── SaleImage.js             # Schema for sale images
  ├── routes/
  │   ├── cartRoutes.js            # Routes for cart operations
  │   ├── imageRoutes.js           # Routes for sale image operations
  │   └── productRoutes.js         # Routes for product operations
  ├── package-lock.json 
  ├── package.json
  └── server.js                    # Entry point for the backend server
```

---

## 📦 Dependencies

### Frontend
```
"dependencies": {
    "@fortawesome/free-brands-svg-icons": "^6.7.2",     # FontAwesome icons 
    "@fortawesome/free-solid-svg-icons": "^6.7.2",     # FontAwesome solid icons 
    "@fortawesome/react-fontawesome": "^0.2.2",        # FontAwesome support
    "@lottiefiles/react-lottie-player": "^3.6.0",      # Lottie animations
    "axios": "^1.7.9",                                 # HTTP client for API calls      
    "firebase": "^11.1.0",                             # Firebase authentication 
    "lottie-react": "^2.4.1",                          # Lottie animations for UI
    "react": "^19.0.0",                                # React framework
    "react-dom": "^19.0.0",                            # ReactDOM for rendering components
    "react-icons": "^5.4.0",                           # React icons library
    "react-router-dom": "^7.1.1",                      # React Router for navigation
    "react-scripts": "5.0.1",                          # React scripts for development
    "react-toastify": "^11.0.2",                       # Toast notifications
    "swiper": "^11.1.15",                              # Swiper.js for carousels
    "tailwindcss": "^3.0.0",                           # Tailwind CSS for styling
    "tailwind-scrollbar": "^3.1.0",                    # Custom scrollbar styling
    "tailwind-scrollbar-hide": "^2.0.0"                # Hides scrollbars
}
```

### Backend
```
"dependencies": {
   "body-parser": "^1.20.3",             # Parses incoming request bodies
    "cloudinary": "^2.5.1",              # Cloudinary for image uploads
    "compression": "^1.7.4",             # Compresses HTTP responses
    "cors": "^2.8.5",                    # Enables CORS policy 
    "dotenv": "^16.4.7",                 # Loads environment variables
    "express": "^4.21.2",                # Express.js framework
    "express-rate-limit": "^7.1.0",      # Rate limiting for security
    "gridfs-stream": "^1.1.1",           # Stream file uploads in MongoDB 
    "helmet": "^7.1.0",                  # Security middleware
    "mongoose": "^8.9.5",                # MongoDB ORM for Node.js 
    "morgan": "^1.10.0",                 # HTTP request logger 
    "multer": "^1.4.4",                  # Middleware for file uploads
    "multer-gridfs-storage": "^5.0.2"    # GridFS storage for Multer
}
```

---

## 🎯 Features

### 🌙 Dark Mode Support  
- Provides a user-friendly dark mode interface for comfortable browsing.  
- Uses a toggle switch to switch between light and dark themes.  
- Saves the user's preference for future visits.  

### 📱💻 Fully Responsive Design  
- Ensures a seamless experience across all devices, including desktops, tablets, and mobile phones.  
- Uses **Tailwind CSS** for a flexible, mobile-first design.  
- Optimized for fast performance and smooth animations.  

### 🔑 User Authentication (Sign in with Google)  
- Allows users to sign in using their **Google accounts** for quick and secure access.  
- Uses **Firebase Authentication** to manage user login sessions.  
- Provides email/password authentication as an alternative option.  

### 🛍️ Admin Control (Add, Edit, Delete Products & Sale Images)  
- Admin dashboard for managing products and sale images effortlessly.  
- Features:  
  - **Add new products** with images, descriptions, and pricing.  
  - **Edit existing products** for price changes, stock updates, and other modifications.  
  - **Delete products** that are no longer available.  
  - Upload and manage **sale banners/images** for promotions.  

### 🗑️ Forgot Password & Account Deletion  
- **Forgot Password:** Users can reset their password via email verification.  
- **Account Deletion:** Allows users to permanently delete their accounts with a confirmation step.  

### 🔍 Filter & Sort Products (By Price, Category)  
- Advanced filtering options to help users find the right products:  
  - **Filter by Category** (Electronics, Clothing, Furniture, etc.).  
  - **Filter by Price Range** (Low to High, High to Low).  
  - **Sort by Best Selling, Ratings, and Discounts**.  
- Provides a **real-time search bar** for instant results.  

### 🛒 Shopping Cart with Quantity Update  
- Users can:  
  - **Add products to the cart** with a single click.  
  - **Increase or decrease product quantity** directly from the cart.  
  - **Remove items from the cart** if no longer needed.  
- Cart data is saved in the user's session to prevent data loss on page refresh.  

### 💳 Secure Checkout with QR-based UPI Payments  
- **Seamless and secure checkout process** using UPI-based QR code payments.  
- Supports payments via apps like Google Pay, PhonePe, Paytm, and BHIM UPI.  
- Automatically generates a unique QR code for each order.  
- Users can scan the QR code and complete payment instantly.  
- Ensures encrypted transactions with **secure backend validation**.  

---

## 🎉 Conclusion
ALCABAA is a powerful and modern ecommerce solution with full admin control, user authentication, and a smooth UI/UX experience. Whether browsing products, adding items to the cart, or making secure payments, ALCABAA ensures a seamless shopping journey.

💖 **Contributions are welcome!** Feel free to fork, open issues, or submit PRs!

## 🌐 Check the Live App  
[Click here to view the app on Vercel!](https://alcabaa-ecommerce.vercel.app/)
