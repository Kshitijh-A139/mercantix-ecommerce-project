export default function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton aspect-[3/4] rounded-sm" />
      <div className="skeleton h-2.5 w-20 rounded-sm" />
      <div className="skeleton h-4 w-2/3 rounded-sm" />
      <div className="skeleton h-3 w-16 rounded-sm" />
    </div>
  );
}
