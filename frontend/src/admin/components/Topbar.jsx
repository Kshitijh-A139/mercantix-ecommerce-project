import { Bell, Menu, Search } from "lucide-react";

export default function Topbar({ user, onOpenSidebar }) {
  const initial = (user?.username || "A")[0].toUpperCase();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 h-16 border-b border-[--color-onyx-700] bg-[--color-onyx-900]/70 backdrop-blur">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="md:hidden grid place-items-center h-9 w-9 rounded-md text-[--color-stone] hover:text-[--color-ivory] hover:bg-[--color-onyx-700]"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-stone]" />
          <input
            type="search"
            placeholder="Search products, orders, customers…"
            className="w-full h-9 bg-[--color-onyx-800] border border-[--color-onyx-600] rounded-md pl-9 pr-3 text-sm text-[--color-ivory] placeholder:text-[--color-onyx-500] focus:outline-none focus:border-[--color-bronze-500]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative grid place-items-center h-9 w-9 rounded-md hover:bg-[--color-onyx-700] text-[--color-stone] hover:text-[--color-ivory]">
          <Bell size={17} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[--color-bronze-400]" />
        </button>

        <div className="flex items-center gap-2 pl-1">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[--color-bronze-500] to-[--color-bronze-700] grid place-items-center text-[--color-onyx-900] text-xs font-semibold">
            {initial}
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] tracking-[0.18em] uppercase text-[--color-stone] leading-tight">Admin</p>
            <p className="text-sm text-[--color-ivory] leading-tight">{user?.username || "—"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
