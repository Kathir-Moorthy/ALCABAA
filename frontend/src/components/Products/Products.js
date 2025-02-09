import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Player } from "@lottiefiles/react-lottie-player";
import FilterProduct from "./FilterProduct";
import MobileFilter from "./MobileFilter";
import ProductCard from "./ProductCard";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState("default");
  const [popupProduct, setPopupProduct] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const selectedCategory = searchParams.get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
        setProducts(response.data);
        initializeFilters(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const initializeFilters = (data) => {
    const filterObj = {};
    data.forEach((product) => {
      if (!filterObj[product.category]) {
        filterObj[product.category] = new Set();
      }
      filterObj[product.category].add(product.subCategory);
    });
    const filterState = {};
    Object.keys(filterObj).forEach((cat) => {
      filterState[cat] = Array.from(filterObj[cat]).reduce((obj, subCat) => {
        obj[subCat] = false;
        return obj;
      }, {});
    });
    setFilters(filterState);
  };

  const handleFilterChange = (category, subCategory) => {
    setFilters({
      ...filters,
      [category]: {
        ...filters[category],
        [subCategory]: !filters[category][subCategory],
      },
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === "" || product.category === selectedCategory;

    const isAnyFilterApplied = Object.values(filters).some((subCategoryFilters) =>
      Object.values(subCategoryFilters).some((isSelected) => isSelected)
    );

    if (!isAnyFilterApplied) {
      return matchesSearchQuery && matchesCategory;
    }

    const subCategoryFilters = filters[product.category];
    const matchesFilters =
      subCategoryFilters &&
      Object.keys(subCategoryFilters).some(
        (subCat) => subCategoryFilters[subCat] && subCat === product.subCategory
      );

    return matchesSearchQuery && matchesCategory && matchesFilters;
  });

  const sortProducts = (productsToSort) => {
    if (sortOption === "priceLowToHigh") {
      return [...productsToSort].sort(
        (a, b) =>
          Math.min(...a.versions.map((v) => v.offerPrice || v.initialPrice)) -
          Math.min(...b.versions.map((v) => v.offerPrice || v.initialPrice))
      );
    }
    if (sortOption === "priceHighToLow") {
      return [...productsToSort].sort(
        (a, b) =>
          Math.min(...b.versions.map((v) => v.offerPrice || v.initialPrice)) -
          Math.min(...a.versions.map((v) => v.offerPrice || v.initialPrice))
      );
    }
    return productsToSort;
  };

  const closePopup = () => {
    setPopupProduct(null);
    setSelectedVersion(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen animate-fade-in">
        <Player
          autoplay
          loop
          src="./loading.json"
          style={{ height: "200px", width: "200px" }}
        />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen text-center mt-10 sm:text-lg md:text-2xl">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen animate-fade-in p-4">
      <div className="grid grid-cols-12 gap-6">
        <div className="hidden md:block col-span-3">
          <FilterProduct
            filters={filters}
            sortOption={sortOption}
            setSortOption={setSortOption}
            handleFilterChange={handleFilterChange}
          />
        </div>
        <div className="col-span-9">
          <ProductCard
            filteredProducts={filteredProducts}
            sortProducts={sortProducts}
            popupProduct={popupProduct}
            setPopupProduct={setPopupProduct}
            closePopup={closePopup}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
          />
        </div>
      </div>
      <MobileFilter 
        isOpen={mobileFilterOpen} 
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        sortOption={sortOption}
        setSortOption={setSortOption}
        handleFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default Product;