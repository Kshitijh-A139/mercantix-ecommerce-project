export default function CategoryNavigation() {
  const categories = ["All", "Electronics", "Fashion", "Home", "Sports"];

  return (
    <div className="flex gap-4 px-6 py-4 bg-white shadow-sm rounded-xl">
      {categories.map((cat) => (
        <button
          key={cat}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}