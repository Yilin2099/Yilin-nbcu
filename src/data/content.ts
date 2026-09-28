export type TabKey = 'brand-matching' | 'competitor-tracker' | 'proposal-generator';

export interface QuickPickFilm {
  id: string;
  code: string;
  year: number;
  title: string;
  genre: string;
}

export const QUICK_PICK_FILMS: QuickPickFilm[] = [
  { id: 'wicked', code: 'WKD', year: 2024, title: 'Wicked', genre: 'Fantasy' },
  { id: 'dm4', code: 'DM4', year: 2024, title: 'Despicable Me 4', genre: 'Animation' },
  { id: 'fastx', code: 'FX', year: 2023, title: 'Fast X', genre: 'Action' },
  { id: 'jw', code: 'JWD', year: 2022, title: 'Jurassic World Dominion', genre: 'Sci-Fi' },
  { id: 'm3gan', code: 'M3G', year: 2023, title: 'M3GAN', genre: 'Horror' },
];

export const INDUSTRY_PULSE = [
  {
    source: 'Warner Bros. × Fast Food',
    summary: 'Q3 Co-branded combo meals & digital toys across 14,000+ global locations.',
    date: 'Sep 2026',
  },
  {
    source: 'Disney Consumer Products',
    summary: 'Partnership volume up 24% YoY across lifestyle & beauty categories.',
    date: 'Aug 2026',
  },
  {
    source: 'Paramount × Beauty Brands',
    summary: 'Halloween franchise-driven IP collaboration forecast for Q4 launch.',
    date: 'Sep 2026',
  },
];
