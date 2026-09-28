interface KpiProps {
  label: string;
  value: string;
  delta?: string;
  accent?: 'brand' | 'green' | 'amber';
}

export default function KpiTile({ label, value, delta, accent = 'brand' }: KpiProps) {
  const accentMap: Record<string, string> = {
    brand: 'text-brand',
    green: 'text-emerald-600',
    amber: 'text-amber-600',
  };
  return (
    <div className="card p-3.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </div>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <div className="tabular text-[22px] font-semibold leading-none text-ink">
          {value}
        </div>
        {delta && (
          <div
            className={[
              'tabular rounded-chip px-2 py-0.5 text-[10px] font-semibold',
              accentMap[accent],
            ].join(' ')}
          >
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}
