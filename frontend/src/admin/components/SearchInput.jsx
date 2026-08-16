import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search…", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-stone]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full bg-[--color-onyx-800] border border-[--color-onyx-600] rounded-md pl-9 pr-3 text-sm text-[--color-ivory] placeholder:text-[--color-onyx-500] focus:outline-none focus:border-[--color-bronze-500]"
      />
    </div>
  );
}
