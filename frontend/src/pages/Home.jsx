import React from "react";
import Navbar from "../components/ui/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="hero">
          <h1>Powerful E-Commerce Dashboard</h1>
          <p>Manage your store, track sales, grow business</p>
          <button className="primary-btn">Explore Products</button>
        </div>

        <div className="features">
          <div className="card">📊 Real-time Analytics</div>
          <div className="card">📦 Inventory Management</div>
          <div className="card">👥 Customer Insights</div>
        </div>
      </div>
    </>
  );
};

export default Home;









// Home.jsx
// import { useEffect, useState } from "react";
// import Navbar from "../components/ui/Navbar";
// import CategoryNavigation from "../components/ui/CategoryNavigation";
// import ProductList from "../components/ui/ProductList";
// import { getProducts } from "../services/productService";

// export default function Home() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     (async () => {
//       const res = await getProducts();
//       setProducts(res.data);
//     })();
//   }, []);

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <Navbar />
//       <CategoryNavigation />
//       <ProductList products={products} />
//     </div>
//   );
// }
