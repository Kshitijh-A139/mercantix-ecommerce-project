import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl border border-dashed border-[--color-onyx-600] bg-[--color-onyx-800]/40">
      <div className="h-12 w-12 grid place-items-center rounded-full bg-[--color-onyx-700] text-[--color-stone] mb-4">
        <Icon size={20} />
      </div>
      <p className="font-display text-lg text-[--color-ivory]">{title}</p>
      {hint && <p className="text-sm text-[--color-stone] mt-1.5 max-w-sm">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
