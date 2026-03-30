import CartIcon from "./CartIcon";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <h1 className="text-xl font-bold text-blue-600">Mercantix</h1>

      <div className="flex items-center gap-6">
        <CartIcon />
        <ProfileDropdown />
      </div>
    </div>
  );
}