// Suspense fallback used while a lazy route chunk is loading.
// Lives outside .admin-scope so it works for both customer + admin entries —
// the spinner uses tokens that are defined on the root.
export default function PageLoader() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 rounded-full border-2 border-[--color-mist] border-t-transparent animate-spin" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[--color-mist]">Loading</span>
      </div>
    </div>
  );
}
