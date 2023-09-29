import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./components/Card";
import { getAllProducts } from "../admin/helper/adminapicall";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  const preloadProducts = () => {
    getAllProducts().then((data) => {
      if (data.err) {
        setError(data.err);
      } else {
        setProducts(data);
      }
    });
  };

  useEffect(() => {
    preloadProducts();
  }, []);

  const getCategoryName = (product) => {
    return <h2 className="text-white text-sm-center nav-tabs">{product.category.name}</h2>;
  };

  const renderProductCards = () => {
    const categories = {};
    products.forEach((product) => {
      const categoryName = product.category.name;
      if (!categories[categoryName]) {
        categories[categoryName] = [];
      }
      categories[categoryName].push(product);
    });

    return Object.keys(categories).map((categoryName, index) => (
      <div key={index}>
        <h4 className="text-white text-sm-center">{categoryName}</h4>
        <div className="row">
          {categories[categoryName].map((product, index) => (
            <div key={index} className="col-sm-12 col-md-4 col-lg-3">
              <Card product={product} />
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <Base
      title="Home"
      description="Welcome, Happy Shopping!"
      className="container"
    >
      {renderProductCards()}
    </Base>
  );
};

export default Home;
