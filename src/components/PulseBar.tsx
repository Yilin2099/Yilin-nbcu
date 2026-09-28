import { INDUSTRY_PULSE } from '../data/content';

export default function PulseBar() {
  return (
    <section className="mt-10 border-t border-line bg-surface-soft/60">
      <div className="mx-auto max-w-[1400px] px-6 py-5 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 text-brand"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12h3l3-8 4 16 3-8h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Industry Pulse
              </div>
              <span className="text-[11px] text-ink-faint">近期联名资讯</span>
            </div>
          </div>
          <div className="text-[11px] text-ink-faint">Live Intelligence Feed</div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {INDUSTRY_PULSE.map((p) => (
            <div
              key={p.source}
              className="card card-hover flex flex-col gap-1.5 p-3.5"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                <div className="truncate text-[12px] font-semibold text-ink">
                  {p.source}
                </div>
                <div className="ml-auto text-[10px] text-ink-faint">{p.date}</div>
              </div>
              <p className="text-[12px] leading-relaxed text-ink-muted">
                {p.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
