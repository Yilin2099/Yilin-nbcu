import { QuickPickFilm, QUICK_PICK_FILMS } from '../data/content';

interface SidebarProps {
  selectedId: string | null;
  onPick: (film: QuickPickFilm) => void;
}

function genreColor(code: string): string {
  switch (code) {
    case 'WKD':
      return 'bg-emerald-600';
    case 'DM4':
      return 'bg-amber-500';
    case 'FX':
      return 'bg-slate-600';
    case 'JWD':
      return 'bg-teal-700';
    case 'M3G':
      return 'bg-rose-600';
    default:
      return 'bg-slate-500';
  }
}

export default function Sidebar({ selectedId, onPick }: SidebarProps) {
  return (
    <aside className="hidden w-[230px] shrink-0 border-r border-line lg:block">
      <div className="sticky top-[64px] max-h-[calc(100vh-64px)] overflow-y-auto px-4 py-6">
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Quick Pick
            </div>
            <div className="mt-0.5 text-[12px] text-ink-faint">
              NBCU 热门影片
            </div>
          </div>
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-ink-faint"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-1 px-1 text-[11px] text-ink-faint">
          Click to populate film
        </p>

        <div className="mt-4 space-y-2">
          {QUICK_PICK_FILMS.map((f) => {
            const selected = f.id === selectedId;
            return (
              <button
                key={f.id}
                onClick={() => onPick(f)}
                className={[
                  'group flex w-full items-center gap-3 rounded-card border px-2.5 py-2.5 text-left transition-all duration-150',
                  selected
                    ? 'border-brand bg-brand/5 shadow-card'
                    : 'border-line bg-surface hover:border-line-strong hover:shadow-card-hover',
                ].join(' ')}
              >
                <div
                  className={[
                    'flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-md text-white shadow-card',
                    genreColor(f.code),
                  ].join(' ')}
                >
                  <div className="text-[10px] font-bold leading-none">
                    {f.code}
                  </div>
                  <div className="mt-0.5 text-[9px] leading-none opacity-90">
                    {String(f.year).slice(-2)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={[
                      'truncate text-[13px] font-semibold',
                      selected ? 'text-ink' : 'text-ink',
                    ].join(' ')}
                  >
                    {f.title}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-[10px] text-ink-faint">{f.year}</span>
                    <span className="chip !h-4 !py-0 !text-[10px]">{f.genre}</span>
                  </div>
                </div>
                {selected && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-brand"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-card border border-dashed border-line bg-surface-soft p-3">
          <p className="text-[11px] leading-relaxed text-ink-muted">
            没有看到目标影片？直接在右侧输入框中输入完整片名即可，AI 会实时生成匹配结果。
          </p>
        </div>
      </div>
    </aside>
  );
}
