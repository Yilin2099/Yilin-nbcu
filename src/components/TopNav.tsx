import { TabKey } from '../data/content';

interface TopNavProps {
  active: TabKey;
  onChange: (key: TabKey) => void;
  configured: boolean;
}

const TABS: { key: TabKey; label: string; hint: string }[] = [
  { key: 'brand-matching', label: 'Brand Matching', hint: '品牌匹配' },
  { key: 'competitor-tracker', label: 'Competitor Tracker', hint: '竞品动态' },
  { key: 'proposal-generator', label: 'Proposal Generator', hint: '提案生成' },
];

export default function TopNav({ active, onChange, configured }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-[64px] max-w-[1400px] items-center gap-4 px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-[11px] font-bold uppercase tracking-wider text-white shadow-card">
            NBCU
          </div>
          <div>
            <div className="text-[15px] font-semibold leading-none text-ink">
              PartnerMatch AI
            </div>
            <div className="mt-1 text-[12px] leading-none text-ink-muted">
              NBCUniversal Film × Brand Partnership Assistant
            </div>
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-1 rounded-[10px] border border-line bg-surface-muted p-1">
          {TABS.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className={[
                  'group relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-surface text-ink shadow-card'
                    : 'text-ink-muted hover:text-ink',
                ].join(' ')}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ink-faint group-hover:bg-brand/60" />
                <span>{t.label}</span>
                <span className="hidden text-[11px] text-ink-faint md:inline">
                  {t.hint}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span
            title={
              configured
                ? 'LLM 已配置 · 可以实时生成'
                : 'LLM 未配置 · 当前展示占位示例'
            }
            className={[
              'inline-flex items-center gap-2 rounded-chip border px-3 py-1 text-[11px] font-medium',
              configured
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-amber-200 bg-amber-50 text-amber-700',
            ].join(' ')}
          >
            <span
              className={[
                'h-1.5 w-1.5 rounded-full',
                configured ? 'bg-emerald-500' : 'bg-amber-500',
              ].join(' ')}
            />
            LLM {configured ? 'POWERED' : 'NOT CONFIGURED'}
          </span>
          <div
            className="h-8 w-8 rounded-full border border-line bg-surface-muted"
            aria-hidden
          />
        </div>
      </div>
    </header>
  );
}
