"use client";

type Action = {
  label: string;
  description?: string;
  value: string;
};

type Props = {
  title: string;
  subtitle?: string;
  actions: Action[];
  onSelect: (value: string) => void;
  compact?: boolean;
};

export default function QuickActions({ title, subtitle, actions, onSelect, compact = false }: Props) {
  return (
    <section className="fade-in-up rounded-[28px] border border-white/8 bg-[color:var(--surface)] p-4 shadow-soft">
      <div className="mb-4">
        <p className="text-sm font-semibold tracking-[0.08em] text-[color:var(--text)]">{title}</p>
        {subtitle ? <p className="mt-1 text-sm text-[color:var(--muted)]">{subtitle}</p> : null}
      </div>

      <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2"}`}>
        {actions.map((action) => (
          <button
            key={action.value}
            type="button"
            onClick={() => onSelect(action.value)}
            className="group rounded-[22px] border border-white/8 bg-[color:var(--surface-strong)] px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--line-strong)] hover:bg-[color:var(--surface-highlight)]"
          >
            <p className="text-sm font-semibold text-[color:var(--text)]">{action.label}</p>
            {action.description ? (
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{action.description}</p>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}
