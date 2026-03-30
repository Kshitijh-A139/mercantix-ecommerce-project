import ProductCard from "./ProductCard";

export default function ProductList() {
  const products = [
    {
      id: 1,
      name: "Headphones",
      price: 99,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Shoes",
      price: 149,
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}