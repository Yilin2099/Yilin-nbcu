import { useMemo, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import KpiTile from '../components/KpiTile';
import { BrandMatch } from '../data/placeholder';
import {
  DEFAULT_BRAND_MATCHES,
  generateBrandMatches,
  isLlmConfigured,
} from '../lib/llm';

interface Props {
  initialFilm: string;
  onUseBrand: (film: string, brand: string) => void;
}

const INDUSTRY_FILTERS = [
  { id: 'all', label: 'All Industries' },
  { id: 'beauty', label: 'Beauty & Cosmetics' },
  { id: 'fashion', label: 'Fashion & Apparel' },
  { id: 'food', label: 'Food & Beverage' },
  { id: 'tech', label: 'Tech & Gaming' },
  { id: 'luxury', label: 'Luxury & Lifestyle' },
];

function scoreClass(score: number) {
  if (score >= 85) return 'bg-brand';
  if (score >= 70) return 'bg-brand/80';
  return 'bg-brand/60';
}

function scorePill(score: number) {
  if (score >= 85) return 'bg-brand/10 text-brand border-brand/30';
  if (score >= 70) return 'bg-sky-50 text-sky-700 border-sky-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

export default function BrandMatchingPage({ initialFilm, onUseBrand }: Props) {
  const [filmInput, setFilmInput] = useState<string>(initialFilm);
  const [film, setFilm] = useState<string>(initialFilm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [industry, setIndustry] = useState('all');
  const [matches, setMatches] = useState<BrandMatch[]>(
    isLlmConfigured() ? [] : DEFAULT_BRAND_MATCHES,
  );
  const configured = isLlmConfigured();

  const filtered = useMemo(() => {
    if (industry === 'all') return matches;
    const map: Record<string, (c: string) => boolean> = {
      beauty: (c) => /beauty|cosmetic|personal care/i.test(c),
      fashion: (c) => /fashion|apparel|footwear|jewelry/i.test(c),
      food: (c) => /f&b|beverage|qsr|retail|food/i.test(c),
      tech: (c) => /tech|gaming/i.test(c),
      luxury: (c) => /luxury|lifestyle|jewelry|accessories/i.test(c),
    };
    return matches.filter((m) => map[industry]?.(m.category) || map[industry]?.(m.tags.join(' ')));
  }, [matches, industry]);

  async function handleGenerate() {
    const target = filmInput.trim();
    if (!target) return;
    setError(null);
    setLoading(true);
    try {
      const list = await generateBrandMatches(target);
      setMatches(list);
      setFilm(target);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === 'LLM_NOT_CONFIGURED') {
        setMatches(DEFAULT_BRAND_MATCHES);
        setFilm(target);
        setError('LLM 尚未配置，当前展示占位示例。配置 .env 后可实时生成任意影片匹配结果。');
      } else {
        setError(`生成失败：${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* 顶部：选片+分析状态 + KPI */}
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="card p-4 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                SELECTED THEATRICAL IP
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="chip">IP</span>
                <span className="chip">NBCU SLATE</span>
                <span className="chip">PG-13 • Musical / Fantasy</span>
              </div>
              <div className="mt-2 text-[15px] font-semibold text-ink">
                {film ? `NBCU · ${film}` : '输入或在左侧选择一部影片开始'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {film && !loading && matches.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-chip border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  LLM Analysis Complete · {matches.length} Partners Identified
                </span>
              )}
              {loading && <LoadingSpinner text="AI 正在分析匹配品牌..." />}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              className="input flex-1"
              placeholder="Enter or select an NBCUniversal film title..."
              value={filmInput}
              onChange={(e) => setFilmInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              className="btn-primary whitespace-nowrap"
              onClick={handleGenerate}
              disabled={loading || !filmInput.trim()}
            >
              {loading ? '分析中...' : '推荐品牌 (Recommend Brands)'}
            </button>
          </div>

          {error && (
            <div className="mt-3 rounded-card border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
              {error}
            </div>
          )}
        </div>

        <KpiTile
          label="Projected Lift"
          value="+31.8%"
          delta="+Brand Recall"
          accent="green"
        />
        <KpiTile
          label="Target Reach"
          value="44.2M"
          delta="Audience"
          accent="brand"
        />
      </div>

      {/* 行业筛选 chips */}
      <div className="flex flex-wrap items-center gap-2">
        {INDUSTRY_FILTERS.map((f, i) => {
          const active = industry === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setIndustry(f.id)}
              className={[
                'chip !px-3 !py-1.5 !text-[12px] transition-colors',
                active
                  ? 'bg-brand text-white shadow-card'
                  : 'hover:bg-surface-muted hover:text-ink',
              ].join(' ')}
            >
              {f.label}
              {i === 0 && (
                <span className="ml-1 tabular text-[10px] opacity-80">({matches.length})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 标题区 */}
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
          AFFINITY MODELING ENGINE · Universal Pictures Q4 Slate
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink">
              Top Recommended Brand Partners for {film || '—'}
            </h2>
            <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-ink-muted">
              AI scoring synthesized from Gen Z & Female (18-34) audience concentration,
              Broadway/fantasy indexing, cross-category viral velocity, and the global theatrical
              window release timing.
            </p>
          </div>
        </div>
      </div>

      {/* 结果网格 */}
      {loading ? (
        <div className="card flex min-h-[240px] items-center justify-center p-10">
          <LoadingSpinner size={22} text="正在为电影匹配最佳合作品牌..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card min-h-[220px] p-8 text-center text-[13px] text-ink-muted">
          {configured
            ? '当前行业没有匹配结果，试试「All Industries」或输入其他片名'
            : '当前行业没有匹配结果'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((m) => (
            <div key={m.code} className="card card-hover flex flex-col gap-3.5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-surface-muted font-mono text-[13px] font-bold uppercase tracking-wide text-ink">
                    {m.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-[15px] font-semibold text-ink">
                        {m.name}
                      </div>
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path
                          d="m9 12 2 2 4-4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="chip !text-[11px]">{m.category}</span>
                      {m.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="chip !bg-emerald-50 !text-emerald-700 !text-[11px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span
                  className={[
                    'tabular rounded-chip border px-2 py-0.5 font-mono text-[11px] font-semibold',
                    scorePill(m.score),
                  ].join(' ')}
                >
                  {m.scoreLabel}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-ink-muted">
                  <span>Demographic Overlap & Creative Resonance</span>
                  <span className="tabular font-semibold text-ink">
                    {m.fitScore} / 10 {m.fitLabel}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                  className={['h-full rounded-full transition-all', scoreClass(m.score)].join(' ')}
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[10px] border border-line bg-surface-soft p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3 text-brand"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 18v-6M12 8h.01" strokeLinecap="round" />
                  </svg>
                  Partnership Rationale
                </div>
                <p className="text-[12.5px] leading-relaxed text-ink">
                  {m.rationale}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-ink-faint"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  </svg>
                  <span className="tabular">{m.metric.label}：{m.metric.value}</span>
                </div>
                <button
                  className="btn-secondary !px-3 !py-1.5 text-[12px]"
                  onClick={() => onUseBrand(film || filmInput, m.name)}
                >
                  Use this brand →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
