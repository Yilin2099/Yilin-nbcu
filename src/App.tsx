import { useEffect, useState } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import PulseBar from './components/PulseBar';
import BrandMatchingPage from './pages/BrandMatchingPage';
import CompetitorTrackerPage from './pages/CompetitorTrackerPage';
import ProposalGeneratorPage from './pages/ProposalGeneratorPage';
import { QUICK_PICK_FILMS, TabKey } from './data/content';
import { isLlmConfigured } from './lib/llm';

export default function App() {
  const [active, setActive] = useState<TabKey>('brand-matching');
  const [selectedFilmId, setSelectedFilmId] = useState<string | null>(
    QUICK_PICK_FILMS[0].id,
  );
  const [brandFilm, setBrandFilm] = useState(QUICK_PICK_FILMS[0].title);
  const [proposalFilm, setProposalFilm] = useState(QUICK_PICK_FILMS[0].title);
  const [proposalBrand, setProposalBrand] = useState('NYX Professional Makeup');

  // 方便在不同 tab 之间共享当前选的电影
  useEffect(() => {
    if (active === 'brand-matching') setBrandFilm(proposalFilm);
  }, [active, proposalFilm]);

  const configured = isLlmConfigured();

  function useBrand(film: string, brand: string) {
    setProposalFilm(film);
    setProposalBrand(brand);
    setActive('proposal-generator');
    // 同步侧栏高亮
    const matched = QUICK_PICK_FILMS.find(
      (f) => f.title.toLowerCase() === film.toLowerCase(),
    );
    if (matched) setSelectedFilmId(matched.id);
  }

  return (
    <div className="min-h-full bg-surface text-ink">
      <TopNav active={active} onChange={setActive} configured={configured} />

      <div className="mx-auto flex max-w-[1400px] items-start">
        <Sidebar
          selectedId={selectedFilmId}
          onPick={(f) => {
            setSelectedFilmId(f.id);
            setBrandFilm(f.title);
            setProposalFilm(f.title);
          }}
        />

        <main className="min-w-0 flex-1 px-5 pb-12 pt-6 lg:px-10">
          {active === 'brand-matching' && (
            <BrandMatchingPage
              initialFilm={brandFilm}
              onUseBrand={useBrand}
            />
          )}
          {active === 'competitor-tracker' && (
            <CompetitorTrackerPage initialFilm={brandFilm} />
          )}
          {active === 'proposal-generator' && (
            <ProposalGeneratorPage
              initialFilm={proposalFilm}
              initialBrand={proposalBrand}
            />
          )}

          <PulseBar />

          <footer className="mt-10 border-t border-line pt-6 text-[11px] leading-relaxed text-ink-faint">
            PartnerMatch AI · NBCUniversal Film × Brand Partnership Assistant
            <br />
            求职展示项目 | 纯前端，不包含实际 NBCU 官方系统与数据 | 所有品牌名与联名案例均为示例占位
          </footer>
        </main>
      </div>
    </div>
  );
}
