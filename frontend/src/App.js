import Navbar from "./common/Navabr";
import Footer from "./common/Footer";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from "./common/DarkModeContext";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import ContactUs from "./components/ContactUs/ContactUs";
import AboutUs from "./components/AboutUs/AboutUs";
import Cart from "./components/Cart/Cart";
import Profile from "./components/Profile/Profile";
import SignUp from "./components/SignUp/SignUp";
import Products from "./components/Products/Products";
import ForgotPass from "./components/Login/ForgotPass";
import Settings from "./components/Settings/Settings";
import NotFound from "./components/Home/NotFound";
import Checkout from "./components/Checkout/Checkout";
import Admin from "./components/Admin/Admin";
import AdminSaleImage from "./components/Admin/AdminSaleImage";
import AdminProduct from "./components/Admin/AdminProduct";

function App() {
  return (
    <>
      <DarkModeProvider>
        <BrowserRouter> {/* Wrap your App with BrowserRouter */}
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/forgotpassword" element={<ForgotPass />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/contactus" element={<ContactUs />}></Route>
            <Route path="/aboutus" element={<AboutUs />}></Route>
            <Route path="/cart" element={<Cart />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/checkout" element={<Checkout />}></Route>
            <Route path="/products" element={<Products />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/adminaccess" element={<Admin />}></Route>
            <Route path="/saleimageadmin" element={<AdminSaleImage />}></Route>
            <Route path="/productadmin" element={<AdminProduct />}></Route>
            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </DarkModeProvider>
    </>
  );
}

export default App;