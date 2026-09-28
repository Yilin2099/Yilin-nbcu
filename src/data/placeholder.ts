export interface BrandMatch {
  code: string;
  name: string;
  category: string;
  tags: string[];
  score: number;
  scoreLabel: string;
  rationale: string;
  metric: {
    label: string;
    value: string;
  };
  fitLabel: string;
  fitScore: number;
}

export interface CompetitorActivity {
  date: string;
  status: 'Live In-Market' | 'Completed' | 'Upcoming Announcement';
  campaignType: string;
  alignment: string;
  studio: string;
  partnership: string;
  summary: string;
  mediaEstimate: string;
  physicalDistribution: string;
  takeaway: string;
  takeawayTitle: string;
  imageKeyword: string;
}

export interface PitchSection {
  title: string;
  subtitle?: string;
  points: string[];
}

export interface PitchProposal {
  targetDemographic: {
    primary: string;
    secondary: string;
    affinity: number;
  };
  strategicFit: string;
  sections: PitchSection[];
  hashtags: string[];
  totalFootprint?: string;
}

export interface MarketShareDatum {
  studio: string;
  value: number;
  lead: string;
}

export const MARKET_SHARE: MarketShareDatum[] = [
  { studio: 'Disney', value: 37.5, lead: 'Lead: CPG Retail & F&B' },
  { studio: 'Warner Bros.', value: 29.1, lead: 'Lead: Experiential & FMCC' },
  { studio: 'Paramount', value: 18.7, lead: 'Lead: Mega QSR Partnerships' },
  { studio: 'Sony', value: 14.7, lead: 'Lead: Consumer Tech & Gaming' },
];

export const EXECUTIVE_TAKEAWAYS = [
  {
    title: 'Animation & Family Slates',
    body: 'Disney\'s 4-month lead time for Moana 2 confectionery indicates our Despicable Me 4 / Minions team should lock 2025 Easter confectionery partner slots immediately.',
  },
  {
    title: 'Seasonal QSR Lock-Outs',
    body: 'Transformers One saturating Q4 Burger King, Wendy\'s, and Subway for upcoming Dreamworks properties — recommend locking Illumination seasonal QSR 90 days before competitors.',
  },
  {
    title: 'Elevated / Mature Co-Branding',
    body: 'Deadpool 2.0 approach and Joker high-fashion alignments applicable to Wicked and Fast franchise prestige / limited-edition lifestyle drops.',
  },
];

export const STUDIO_FILTERS = [
  { id: 'all', label: 'All Studios', count: 28 },
  { id: 'disney', label: 'Disney Consumer Products', count: 11 },
  { id: 'wb', label: 'Warner Bros. Discovery', count: 9 },
  { id: 'paramount', label: 'Paramount Pictures', count: 5 },
  { id: 'sony', label: 'Sony Pictures', count: 3 },
];

export const TIME_RANGES = [
  { id: '90d', label: 'Past 90 Days' },
  { id: '6m', label: 'Past 6 Months' },
  { id: '2025', label: 'Upcoming 2025' },
];

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Types' },
  { id: 'promo', label: 'Promo / QSR' },
  { id: 'merch', label: 'Merchandise' },
  { id: 'experiential', label: 'Experiential' },
];

export const COMPETITOR_ACTIVITIES: CompetitorActivity[] = [
  {
    date: 'Aug 2026',
    status: 'Live In-Market',
    campaignType: 'Merchandise & Retail',
    alignment: 'Theatrical Alignment',
    studio: 'Disney',
    partnership: 'Disney · Moana 2 × Hawaiian Host',
    summary:
      'Co-branded tropical chocolate boxes, limited retail shelf displays at Target & Costco, paired with an integrated consumer sweepstakes for an all-expenses-paid Hawaii vacation package.',
    mediaEstimate: '120M+ Impressions',
    physicalDistribution: '4,200 Retail Doors',
    takeawayTitle: 'NBCU COUNTER STRATEGY',
    takeaway:
      'Direct benchmark to Universal holiday animation slates. Note their aggressive 4-month QSR/confectionery retail lock before theatrical premiere. Recommend locking Illumination seasonal QSR 90 days before Dreamworks pressure.',
    imageKeyword: 'Moana tropical chocolate retail displays',
  },
  {
    date: 'Jul 2026',
    status: 'Live In-Market',
    campaignType: 'Packaging & Global Rollout',
    alignment: 'Home Entertainment Alignment',
    studio: 'Warner Bros. Discovery',
    partnership: 'Warner Bros. · Beetlejuice Beetlejuice × Fanta (Coca-Cola)',
    summary:
      'Custom limited-edition black-and-white striped soda packs featuring character artwork, interactive AR portal accessible directly on packaging, and a coordinated global retail rollout spanning 50+ countries.',
    mediaEstimate: '#1 Halloween Brand on TikTok',
    physicalDistribution: 'Global FMCG Scale',
    takeawayTitle: 'BEETLEJUICE / UNIVERSAL APPLICATION',
    takeaway:
      'Strong operational precedent for M3GAN 2.0 and Blumhouse horror-comedy seasonal partnerships. Prove packaged beverage cans offer viral unboxings among Gen Z when visual design leans fully into IP aesthetics.',
    imageKeyword: 'Beetlejuice themed Fanta packaging striped',
  },
  {
    date: 'May 2026',
    status: 'Completed',
    campaignType: 'Co-Branded TV Spot & Digital',
    alignment: 'Non-Alcoholic Beverage',
    studio: 'Disney / Marvel Studios',
    partnership: 'Disney · Deadpool & Wolverine × Heineken 0.0',
    summary:
      'High-budget custom filmed commercial featuring Ryan Reynolds and Hugh Jackman in-character, using deadpan humor and meta fourth-wall breaking integration to navigate R-rated IP constraints.',
    mediaEstimate: '45M Views (72 Hours)',
    physicalDistribution: '+300% Brand Recall Lift',
    takeawayTitle: 'FAST & FURIOUS BENCHMARK',
    takeaway:
      'Sets the industry gold standard for mature IP deals where non-alcoholic extensions allow premium beverage brands to participate safely. Model this for Fast & Furious franchise talent integrations.',
    imageKeyword: 'Deadpool Heineken zero beer commercial still',
  },
  {
    date: 'Oct 2026',
    status: 'Upcoming Announcement',
    campaignType: 'Luxury & Experiential',
    alignment: 'High Fashion / Cosmetic',
    studio: 'Warner Bros. Discovery',
    partnership: 'Warner Bros. · Joker: Folie à Deux × YSL Beauty',
    summary:
      'Awaited joint editorial makeup collaboration, VIP red carpet glam suites at the Venice Film Festival, and bespoke boutique pop-up retail installations throughout New York and Paris.',
    mediaEstimate: 'High-Net-Worth 25-45',
    physicalDistribution: 'Top Tier Fashion PR',
    takeawayTitle: 'WICKED LUXURY POSITIONING',
    takeaway:
      'Directly informs NBCU strategy for Wicked. We can position Glinda/Elphaba beauty lines in luxury fragrance/cosmetics (e.g., Prada Beauty, Chanel) rather than mass-market drugstore aisles.',
    imageKeyword: 'YSL beauty x Joker luxury pop-up store',
  },
  {
    date: 'Jun 2026',
    status: 'Live In-Market',
    campaignType: 'Happy Meal & Global QSR',
    alignment: 'Family Entertainment Scale',
    studio: 'Paramount Pictures',
    partnership: 'Paramount · Transformers One × McDonald\'s',
    summary:
      'Collectable converting action figure toys across 14,000+ locations globally, accompanied by proprietary McDonald\'s mobile app mini-game integration and complete drive-thru digital signage takeovers.',
    mediaEstimate: '330M+ Units Globally',
    physicalDistribution: '14,000+ Restaurants',
    takeawayTitle: 'NBCU ILLUMINATION COMPARISON',
    takeaway:
      'Direct benchmark for Despicable Me 4 / Minions activations. McDonald\'s toy velocity remains unmatched; NBCU should preserve its primary global Tier-1 fast food lock for next year\'s slate.',
    imageKeyword: 'Transformers McDonalds happy meal toys display',
  },
];

export const FALLBACK_BRAND_MATCHES: BrandMatch[] = [
  {
    code: 'NYX',
    name: 'NYX Professional Makeup',
    category: 'Beauty / Cosmetics',
    tags: ['High Gen Z Affinity', 'TIER 1 PRIORITY'],
    score: 94,
    scoreLabel: '94%',
    rationale:
      'NYX × Wicked: Limited-edition Emerald City & Glinda pink collector palettes. High viral TikTok traction matching Wicked\'s vibrant visual fantasy aesthetic.',
    metric: { label: 'Forecast Impressions', value: '12.8M' },
    fitLabel: 'Co-Branding Fit',
    fitScore: 9.4,
  },
  {
    code: 'SBUX',
    name: 'Starbucks',
    category: 'F&B / QSR',
    tags: ['Mass Foot Traffic', 'HIGH CONVERSION'],
    score: 89,
    scoreLabel: '89%',
    rationale:
      'Starbucks × Wicked: Themed seasonal handcrafted beverages (Elphaba Green Apple Matcha & Glinda Berry Sparkler) with reusable specialty cups.',
    metric: { label: 'North American Locations', value: '16,000+' },
    fitLabel: 'Co-Branding Fit',
    fitScore: 8.9,
  },
  {
    code: 'TGT',
    name: 'Target',
    category: 'Retail',
    tags: ['Exclusive Shop-in-Shop', 'HIGH CONVERSION'],
    score: 86,
    scoreLabel: '86%',
    rationale:
      'Target × Wicked: Curated endcap lifestyle pop-up, dedicated in-store shop-in-shop, and omnichannel giftable assortment driving family and collector merchandise sales ahead of holiday premiere.',
    metric: { label: 'Multi-Category Omnichannel', value: '—' },
    fitLabel: 'Co-Branding Fit',
    fitScore: 8.6,
  },
  {
    code: 'PND',
    name: 'Pandora Jewelry',
    category: 'Jewelry / Accessories',
    tags: ['Giftable Holiday IP', 'OPPORTUNITY'],
    score: 82,
    scoreLabel: '82%',
    rationale:
      'Pandora × Wicked: Collectible charm collection featuring Elphaba\'s broomstick, witch hat, and bubble motifs targeting holiday gifting.',
    metric: { label: 'Global Holiday Gifting Peak', value: '—' },
    fitLabel: 'Co-Branding Fit',
    fitScore: 8.2,
  },
  {
    code: 'LUSH',
    name: 'Lush Cosmetics',
    category: 'Personal Care',
    tags: ['Eco & Vegan', 'OPPORTUNITY'],
    score: 78,
    scoreLabel: '78%',
    rationale:
      'Magical bath bombs and potion bubble bars themed around Shiz University, appealing to theatrical lifestyle fans.',
    metric: { label: 'High Experiential Store Drive', value: '—' },
    fitLabel: 'Co-Branding Fit',
    fitScore: 7.8,
  },
  {
    code: 'CROCS',
    name: 'Crocs',
    category: 'Footwear',
    tags: ['Youth Culture', 'OPPORTUNITY'],
    score: 75,
    scoreLabel: '75%',
    rationale:
      'Glow-in-the-dark green clogs with exclusive Wicked Jibbitz charms, viral social youth activation.',
    metric: { label: 'High Digital Charm Add-on Margin', value: '—' },
    fitLabel: 'Co-Branding Fit',
    fitScore: 7.5,
  },
];

export const FALLBACK_PITCH: PitchProposal = {
  targetDemographic: {
    primary: 'Females 18-34',
    secondary: 'Broadway/Theater Enthusiasts & Cosplay Creators',
    affinity: 94.8,
  },
  strategicFit:
    'A high-impact theatrical beauty collaboration capitalizing on the cultural duality of Elphaba (emerald green) and Glinda (bubblegum pink) to engage Gen Z beauty creators and theatrical moviegoers worldwide.',
  sections: [
    {
      title: '合作亮点 · Why It Works',
      points: [
        'Aesthetic & Chromatic Alignment: High-contrast color story (Emerald Shimmer vs. Shiz Pink) seamlessly translates into Wicked palettes, lip oils, and body pigments that dominate editorial beauty discourse. IP Chromatic Index: 9.8 / 10.',
        'Gen Z Viral Velocity: NYX commands 4.2M+ TikTok followers with unmatched creator engagement; Wicked soundtrack trends are projected to drive 500M+ TikTok impressions during theatrical ramp-up. Projected Social REACH: +500M Impr.',
        'Theatrical Window Synergy: Launching 4 weeks prior to November release date creates organic anticipation, fueling audience looks leading directly into opening box office weekend. Window Lead Time: T-minus 28 Days.',
      ],
    },
    {
      title: '周边产品 · Co-Branded Merch & Limited Edition SKUs',
      points: [
        'HERO SKU · 12-shade dual-sided chromatic palette featuring velvet mattes and duochrome foils with embossed witch hat and broomstick textures. MSRP: $32 USD. Ulta / Sephora distribution.',
        'VOLUME DRIVER · Lip glaze duo matching Elphaba & Glinda shades, plus collectible character charms. MSRP: $16 USD. Mass Retail (Target, Walmart, Ulta Beauty, Shoppers).',
        'COLLECTOR TIER · Emerald City skyline-inspired collector set: brush roll + specialty body oil + premium mirror, limited to 50,000 units globally. MSRP: $82 USD. Global Launch.',
      ],
    },
    {
      title: '社媒话题 · Social Campaign & Digital Activation',
      points: [
        'TikTok Transformation Challenge: Top 50 beauty creators seeded with custom theatrical PR cauldrons to create "Glinda vs. Elphaba" half-face split transformation reels using official audio clips. KPI: 120M+ Views Across Creator Network.',
        'Interactive AR Beauty Lens: Co-developed Snapchat and Instagram filters enabling fans to digitally apply movie makeup looks; sharing posts unlocks premiere screening ticket giveaways. Target: 3.5M AR Lens Interactions.',
        'Live Shopping & Backstage Masterclass: Ulta Beauty × TikTok Shop broadcast featuring the film\'s lead makeup department head breaking down screen-ready techniques and early-access SKU drops. Est. Conversion: 4.8X Live Cart Rate.',
      ],
    },
    {
      title: '线下活动 · Theater & Retail Experience',
      points: [
        'EXHIBITION CIRCUIT · AMC & Regal Theatres Glam Stations: Express touch-up beauty bars at 50 premier theater flagship lobbies across opening weekend, offering moviegoers quick lip refreshes and exclusive sampling sachets. Locations: Top 15 Metros · Opening 3-Day Push.',
        'RETAIL CO-MARKETING · Ulta Beauty Window Takeovers: Synchronized full front-window installations, end-cap displays, and interactive photo installations across 1,400+ Ulta doors nationwide throughout Q4. Reach: 1,400 Stores · Dual-Branded POS Displays.',
        'STUDIO EVENT · Broadway & Hollywood Red Carpet VIP Suite: Exclusive backstage beauty sponsor for premiere press junket, providing verified talent touch-ups, influencer green-room hosting, and co-branded photo-wall branding. VIP Impressions: Tier-1 Global Entertainment Press.',
      ],
    },
  ],
  hashtags: ['#DefyGravityGlam', '#PinkGoesWithGreen'],
  totalFootprint: '1,400+ Total Footprint Doors',
};
