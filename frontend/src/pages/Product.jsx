import React, { useEffect, useState } from "react";
import ProductList from "../components/ui/ProductList";
import { getProducts } from "../services/productService";

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchData();
  }, []);

  return (
    <div className="product-page">
      <h2>Explore Our Latest Products</h2>
      <ProductList products={products} />
    </div>
  );
};

export default Product;