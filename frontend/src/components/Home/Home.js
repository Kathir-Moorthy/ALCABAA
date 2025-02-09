import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuBar from "../../common/MenuBar";
import Marquee from "./Marquee";
import SaleImage from "./SaleImage";
import TodaysDeals from "./TodayDeals";
import KillerOffer from "./KillerOffer";
import BestBuy from './BestBuy';
import FeatureCards from "./FeatureCards";
import NewsletterSubscription from "./NewsletterSubscription";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
        setProducts(response.data);
      } catch {
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen animate-fade-in">
      <MenuBar />
      <Marquee />
      <SaleImage />
      <TodaysDeals products={products} />
      <KillerOffer products={products} />
      <BestBuy products={products} />
      <FeatureCards />
      <NewsletterSubscription />
    </div>
  );
};

export default Home;