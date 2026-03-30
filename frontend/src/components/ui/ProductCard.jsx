export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.name}
        className="h-40 w-full object-cover rounded-lg"
      />

      <h3 className="mt-3 font-semibold">{product.name}</h3>
      <p className="text-gray-500">${product.price}</p>

      <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Add to Cart
      </button>
    </div>
  );
}