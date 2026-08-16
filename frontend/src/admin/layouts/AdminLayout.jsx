import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-scope flex min-h-screen">
      <Sidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar user={user} onOpenSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
