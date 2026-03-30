import { useState } from "react";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Profile
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2">
          <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
            Profile
          </button>
          <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
            Orders
          </button>
          <button className="block w-full text-left px-3 py-2 hover:bg-red-100 text-red-600 rounded">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}