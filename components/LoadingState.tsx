import { LoaderCircle } from "lucide-react";

export default function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[color:var(--surface)] shadow-soft">
        <LoaderCircle className="animate-spin text-[color:var(--accent)]" size={28} />
      </div>
      <p className="text-sm uppercase tracking-[0.22em] text-[color:var(--muted-strong)]">{message}</p>
    </div>
  );
}
