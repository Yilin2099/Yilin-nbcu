import { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { PitchProposal } from '../data/placeholder';
import {
  DEFAULT_PITCH,
  generatePitchProposal,
  isLlmConfigured,
} from '../lib/llm';

interface Props {
  initialFilm: string;
  initialBrand: string;
}

export default function ProposalGeneratorPage({ initialFilm, initialBrand }: Props) {
  const [film, setFilm] = useState(initialFilm);
  const [brand, setBrand] = useState(initialBrand);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pitch, setPitch] = useState<PitchProposal | null>(
    isLlmConfigured() ? null : DEFAULT_PITCH,
  );
  const configured = isLlmConfigured();

  async function handleGenerate() {
    if (!film.trim() || !brand.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const p = await generatePitchProposal(film.trim(), brand.trim());
      setPitch(p);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === 'LLM_NOT_CONFIGURED') {
        setPitch(DEFAULT_PITCH);
        setError('LLM 尚未配置，当前展示占位示例。配置 .env 后可实时为任意电影+品牌生成专属提案。');
      } else {
        setError(`生成失败：${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* 头部输入栏 */}
      <div className="card p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              FILM TITLE / THEATRICAL IP
              <span className="chip !bg-emerald-50 !text-emerald-700 !text-[10px]">
                Verified State
              </span>
            </div>
            <div className="relative">
              <input
                className="input pl-9"
                placeholder="例如：Wicked"
                value={film}
                onChange={(e) => setFilm(e.target.value)}
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-ink-faint">
                NBCU
              </span>
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              BRAND PARTNER
              <span className="chip !bg-brand/10 !text-brand !text-[10px]">
                Pre-Selected
              </span>
            </div>
            <div className="relative">
              <input
                className="input pl-10"
                placeholder="例如：NYX Professional Makeup"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-ink-faint">
                TIER-1
              </span>
            </div>
          </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-[11px] text-ink-muted">
              <span className="tabular text-[10px]">v1.2s · NBCU-Studio-Partner-v3</span>
            </div>
            <button
              className="btn-primary"
              onClick={handleGenerate}
              disabled={loading || !film.trim() || !brand.trim()}
            >
              {loading ? (
                <LoadingSpinner text="生成中..." />
              ) : pitch ? (
                <>🔄 重新生成提案</>
              ) : (
                <>✨ 生成 Pitch 方案 (Generate Proposal)</>
              )}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-4 rounded-card border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div className="card flex min-h-[420px] items-center justify-center p-10">
          <LoadingSpinner size={22} text="AI 正在撰写完整提案大纲..." />
        </div>
      ) : !pitch ? (
        <div className="card min-h-[360px] p-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6M9 13h6M9 17h6M9 9h2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-[15px] font-semibold text-ink">
            选好电影和品牌，点上方按钮生成完整的 Pitch 大纲
          </div>
          <p className="mx-auto mt-1.5 max-w-xl text-[13px] leading-relaxed text-ink-muted">
            或者先在「品牌匹配」页点某张卡片上的 Use this brand → 会自动把电影和品牌填好带过来。
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          {/* 提案 header：标题 + 人群卡片 */}
          <div className="grid gap-0 border-b border-line md:grid-cols-[1.7fr_360px]">
            <div className="p-6">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="chip !bg-brand/10 !text-brand !text-[11px]">
                  EXECUTIVE STRATEGY DRAFT
                </span>
                <span className="chip !text-[11px]">Confidential</span>
                <span className="chip !text-[11px]">For Internal NBCU Pitch Prep</span>
              </div>
              <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-ink">
                Partnership Pitch Outline: {film || 'Film'} × {brand || 'Brand'}
              </h2>
              <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-ink-muted">
                {pitch.strategicFit}
              </p>
            </div>

            <div className="border-t border-line bg-surface-soft/60 p-6 md:border-l md:border-t-0">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                🎯 TARGET DEMOGRAPHIC
              </div>
              <div className="space-y-1.5 text-[13px] text-ink-muted">
                <div>
                  <span className="text-ink-faint">Primary: </span>
                  <span className="font-medium text-ink">{pitch.targetDemographic.primary}</span>
                </div>
                <div>
                  <span className="text-ink-faint">Secondary: </span>
                  <span className="font-medium text-ink">
                    {pitch.targetDemographic.secondary}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-ink-muted">Audience Affinity Match</span>
                  <span className="tabular font-semibold text-brand">
                    {pitch.targetDemographic.affinity}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${pitch.targetDemographic.affinity}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <span className="chip !bg-emerald-50 !text-emerald-700 !text-[11px]">
                  High Strategic Fit
                </span>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-0 divide-y divide-line">
            {pitch.sections.map((sec, idx) => (
              <section key={sec.title + idx} className="p-6">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 font-mono text-[12px] font-bold text-brand">
                      0{idx + 1}
                    </div>
                    <div>
                      <h3 className="text-[17px] font-semibold leading-tight text-ink">
                        {sec.title}
                      </h3>
                      {sec.subtitle && (
                        <div className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                          {sec.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  {idx === 1 && (
                    <span className="chip !text-[11px]">
                      3 Concept SKUs Outlined
                    </span>
                  )}
                  {idx === 2 && (
                    <div className="flex items-center gap-1.5">
                      {pitch.hashtags.map((h) => (
                        <span
                          key={h}
                          className="chip !bg-brand/5 !text-brand !text-[11px]"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                  {idx === 3 && pitch.totalFootprint && (
                    <span className="chip !text-[11px]">
                      {pitch.totalFootprint}
                    </span>
                  )}
                </div>

                {idx === 1 ? (
                  <div className="grid gap-3 md:grid-cols-3">
                    {sec.points.map((pt, pi) => (
                      <div
                        key={pi}
                        className="flex flex-col gap-2 rounded-[10px] border border-line bg-surface p-3"
                      >
                        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
                          {pi === 0 ? 'HERO SKU' : pi === 1 ? 'VOLUME DRIVER' : 'COLLECTOR TIER'}
                        </div>
                        <div className="h-24 w-full rounded-md bg-gradient-to-br from-surface-muted to-surface" />
                        <p className="text-[12px] leading-relaxed text-ink-muted">{pt}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-3">
                    {sec.points.map((pt, pi) => (
                      <div
                        key={pi}
                        className="flex flex-col gap-2 rounded-[10px] border border-line bg-surface p-3.5"
                      >
                        {idx === 2 && (
                          <div className="mb-1 flex items-center justify-between">
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-brand" fill="none" stroke="currentColor" strokeWidth="2">
                              {pi === 0 && <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />}
                              {pi === 1 && <path d="M9 12h6M12 9v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />}
                              {pi === 2 && <rect x="3" y="4" width="18" height="16" rx="2" />}
                              {idx !== 2 && <circle cx="12" cy="12" r="10" />}
                            </svg>
                            <span className="tabular text-[11px] text-ink-faint">
                              KPI {pi === 0 ? '120M+ Views' : pi === 1 ? '3.5M Interactions' : '4.8X Live Cart Rate'}
                            </span>
                          </div>
                        )}
                        <p className="text-[12.5px] leading-relaxed text-ink-muted">{pt}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-soft/60 px-6 py-3.5">
            <div className="flex items-center gap-2 text-[12px] text-ink-muted">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
              Created: Today, Draft Version 1.0 (Pitch-Ready)
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary !text-[12px]">
                Export as Outline (.PDF / .DOCX)
              </button>
              <button className="btn-primary !text-[12px]">
                💾 Save to Pitch History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
