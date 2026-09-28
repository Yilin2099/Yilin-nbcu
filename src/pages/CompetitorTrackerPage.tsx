import { useMemo, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  COMPETITOR_ACTIVITIES,
  EXECUTIVE_TAKEAWAYS,
  MARKET_SHARE,
  STUDIO_FILTERS,
  TIME_RANGES,
  CATEGORY_FILTERS,
  CompetitorActivity,
} from '../data/placeholder';
import {
  DEFAULT_COMPETITOR_ACTIVITIES,
  generateCompetitorActivities,
  isLlmConfigured,
} from '../lib/llm';

interface Props {
  initialFilm: string;
}

function statusStyle(s: CompetitorActivity['status']) {
  if (s === 'Live In-Market')
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (s === 'Completed')
    return 'bg-surface-muted text-ink-muted border-line-strong';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

export default function CompetitorTrackerPage({ initialFilm }: Props) {
  const [filmInput, setFilmInput] = useState(initialFilm);
  const [list, setList] = useState<CompetitorActivity[]>(
    isLlmConfigured() ? COMPETITOR_ACTIVITIES : DEFAULT_COMPETITOR_ACTIVITIES,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studio, setStudio] = useState('all');
  const [time, setTime] = useState('90d');
  const [cat, setCat] = useState('all');
  const [showSummary, setShowSummary] = useState(true);
  const configured = isLlmConfigured();

  const filtered = useMemo(() => {
    return list.filter((a) => {
      if (studio !== 'all') {
        const map: Record<string, (x: string) => boolean> = {
          disney: (x) => /disney|marvel/i.test(x),
          wb: (x) => /warner|wb/i.test(x),
          paramount: (x) => /paramount/i.test(x),
          sony: (x) => /sony/i.test(x),
        };
        const fn = map[studio];
        if (fn && !fn(a.studio) && !fn(a.partnership)) return false;
      }
      if (cat !== 'all') {
        const type = a.campaignType.toLowerCase();
        if (cat === 'promo' && !/qsr|promo|tv|spot/.test(type)) return false;
        if (cat === 'merch' && !/merch|retail|packaging|happy meal/.test(type)) return false;
        if (cat === 'experiential' && !/experiential|luxury|popup|pop-up|pop up/.test(type))
          return false;
      }
      return true;
    });
  }, [list, studio, cat]);

  async function handleGenerate() {
    const f = filmInput.trim();
    if (!f) return;
    setError(null);
    setLoading(true);
    try {
      const data = await generateCompetitorActivities(f);
      setList(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === 'LLM_NOT_CONFIGURED') {
        setList(DEFAULT_COMPETITOR_ACTIVITIES);
        setError('LLM 尚未配置，当前展示占位示例。配置 .env 后可基于任意影片实时生成竞品动态。');
      } else {
        setError(`生成失败：${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  const maxShare = Math.max(...MARKET_SHARE.map((s) => s.value));

  return (
    <div className="space-y-5">
      {/* 头部 */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div className="card p-4 lg:col-span-2">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            STUDIO INTELLIGENCE NETWORK · Q3–Q4 Live Feed
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink">
                Competitor Partnership Tracker · 竞品联名动态
              </h2>
              <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-ink-muted">
                Real-time surveillance of Disney, Warner Bros., Paramount & Sony studio brand
                alliances, commercial deal structures, and global theatrical co-promotions.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <input
                className="input sm:w-[260px]"
                placeholder="参考影片，用于生成相关竞品动态..."
                value={filmInput}
                onChange={(e) => setFilmInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button className="btn-secondary" onClick={handleGenerate} disabled={loading}>
                {loading ? '分析中...' : '刷新竞品动态'}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-3 rounded-card border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
              {error}
            </div>
          )}
        </div>

        <div className="card p-4">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            知识库统计
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-ink-muted">Comparative Digest</span>
              <span className="tabular text-[18px] font-semibold text-ink">48</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-ink-muted">Deals Indexed</span>
              <span className="tabular text-[18px] font-semibold text-ink">218</span>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选条 */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {STUDIO_FILTERS.map((s) => {
            const active = s.id === studio;
            return (
              <button
                key={s.id}
                onClick={() => setStudio(s.id)}
                className={[
                  'chip !px-3 !py-1.5 !text-[12px] transition-colors',
                  active ? 'bg-brand text-white shadow-card' : 'hover:bg-surface-muted hover:text-ink',
                ].join(' ')}
              >
                {s.label}
                <span className="ml-1 tabular text-[10px] opacity-80">({s.count})</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="mr-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" />
            </svg>
            TIME RANGE:
          </div>
          {TIME_RANGES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTime(t.id)}
              className={[
                'chip !px-3 !py-1.5 !text-[12px] transition-colors',
                t.id === time ? 'bg-surface-strong text-brand shadow-card' : 'hover:bg-surface-muted hover:text-ink',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
          <div className="mx-2 h-5 w-px bg-line" />
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            CATEGORY:
          </div>
          {CATEGORY_FILTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={[
                'chip !px-3 !py-1.5 !text-[12px] transition-colors',
                c.id === cat ? 'bg-surface-muted text-ink shadow-card' : 'hover:bg-surface-muted hover:text-ink',
              ].join(' ')}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Executive Takeaway Summary */}
      {showSummary && (
        <div className="card overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-line bg-surface-soft px-4 py-2.5">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" strokeLinecap="round" />
                <path d="m7 14 4-4 4 4 5-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-[12px] font-semibold text-ink">
                NBCU Executive Takeaway Summary
              </div>
              <span className="chip !bg-amber-50 !text-amber-700 !text-[10px]">
                STRATEGIC MEMO
              </span>
            </div>
            <button
              onClick={() => setShowSummary(false)}
              className="btn-ghost !py-1 !text-[12px]"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-3">
            {EXECUTIVE_TAKEAWAYS.map((t) => (
              <div
                key={t.title}
                className="rounded-[10px] border border-line bg-surface p-3.5"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
                  {t.title}
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 动态时间线 */}
      {loading ? (
        <div className="card flex min-h-[260px] items-center justify-center p-10">
          <LoadingSpinner size={22} text="AI 正在梳理竞品联名动态..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card min-h-[220px] p-8 text-center text-[13px] text-ink-muted">
          没有符合当前筛选的联名动态，换其他工作室或类别试试
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a, i) => (
            <div key={`${a.partnership}-${i}`} className="card overflow-hidden p-0">
              <div className="grid gap-0 md:grid-cols-[360px_1fr]">
                {/* 左侧：图片占位 */}
                <div className="relative flex min-h-[180px] items-center justify-center border-b border-line bg-surface-soft p-4 md:border-b-0 md:border-r">
                  <div className="w-full max-w-[320px] rounded-[10px] border border-dashed border-line-strong bg-surface p-4 text-center">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      Placeholder Visual
                    </div>
                    <div className="mx-auto h-24 w-full rounded-md bg-gradient-to-br from-surface-muted to-surface" />
                    <div className="mt-2 text-[12px] text-ink-muted">
                      {a.imageKeyword}
                    </div>
                  </div>
                </div>
                {/* 右侧：信息 */}
                <div className="flex flex-col gap-3 p-4.5 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold text-ink-muted">{a.date}</span>
                      <span className={['chip border !text-[11px]', statusStyle(a.status)].join(' ')}>
                        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                        {a.status}
                      </span>
                      <span className="chip">{a.campaignType}</span>
                      <span className="chip">{a.alignment}</span>
                    </div>
                  </div>

                  <h3 className="text-[17px] font-semibold leading-snug text-ink">
                    {a.partnership}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-ink-muted">{a.summary}</p>

                  <div className="grid gap-2 border-y border-line py-3 text-[12px] sm:grid-cols-3">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                        EST. MEDIA IMPRESSIONS
                      </div>
                      <div className="mt-0.5 tabular font-semibold text-ink">
                        {a.mediaEstimate}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                        PHYSICAL DISTRIBUTION
                      </div>
                      <div className="mt-0.5 tabular font-semibold text-ink">
                        {a.physicalDistribution}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                        STUDIO
                      </div>
                      <div className="mt-0.5 font-semibold text-ink">{a.studio}</div>
                    </div>
                  </div>

                  <div className="rounded-[10px] border border-line bg-brand/[0.04] p-3.5">
                    <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2 3 7v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V7l-9-5Z" />
                      </svg>
                      {a.takeawayTitle}
                    </div>
                    <p className="text-[12.5px] leading-relaxed text-ink">
                      {a.takeaway}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 底部 Market Share */}
      <div className="card p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              STUDIO MARKET SHARE BREAKDOWN
            </div>
            <h3 className="mt-1 text-[17px] font-semibold text-ink">
              Brand Partnership Category Penetration (Past 90 Days)
            </h3>
          </div>
          <div className="text-[11px] text-ink-faint">Updated 2h ago</div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {MARKET_SHARE.map((s) => (
            <div key={s.studio} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-ink">{s.studio}</span>
                <span className="tabular text-[13px] font-semibold text-ink">
                  {s.value}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${(s.value / maxShare) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-ink-muted">{s.lead}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
