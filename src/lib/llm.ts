import {
  BrandMatch,
  CompetitorActivity,
  PitchProposal,
  FALLBACK_BRAND_MATCHES,
  COMPETITOR_ACTIVITIES,
  FALLBACK_PITCH,
} from '../data/placeholder';

const PROVIDER = (import.meta.env.VITE_LLM_PROVIDER || 'openai').toLowerCase();
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_BASE = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1';
const GEMINI_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || '';
const GEMINI_MODEL = import.meta.env.VITE_GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash';

export function isLlmConfigured(): boolean {
  if (PROVIDER === 'gemini') return Boolean(GEMINI_KEY);
  return Boolean(OPENAI_KEY);
}

function safeJsonFromText(raw: string): unknown {
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  const candidate = (match ? match[1] || match[0] : raw).trim();
  try {
    return JSON.parse(candidate);
  } catch {
    try {
      return JSON.parse(raw.trim());
    } catch {
      return null;
    }
  }
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const url = `${OPENAI_BASE.replace(/\/$/, '')}/chat/completions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI API 错误 ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string) || '';
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API 错误 ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.candidates?.[0]?.output ||
    ''
  );
}

async function callLlm(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!isLlmConfigured()) {
    throw new Error('LLM_NOT_CONFIGURED');
  }
  return PROVIDER === 'gemini'
    ? callGemini(systemPrompt, userPrompt)
    : callOpenAI(systemPrompt, userPrompt);
}

const BRAND_SYSTEM = `你是 NBCUniversal 旗下 Partnerships 团队的品牌合作研究员。用户会给出一部电影名，你输出 6 个最适合联名的品牌推荐，必须严格按以下 JSON 格式返回（不要加任何解释文字）：
{
  "matches": [
    {
      "code": "3-4字品牌缩写大写",
      "name": "品牌全名",
      "category": "行业，如 Beauty / Cosmetics",
      "tags": ["标签1", "标签2"],
      "score": 0到100整数匹配度,
      "scoreLabel": "如 94%",
      "rationale": "1-2 句话说明为什么这个品牌和这部电影联名合适，要具体有画面感",
      "metric": { "label": "数据类型标签", "value": "具体数值" },
      "fitLabel": "Co-Branding Fit",
      "fitScore": 0到10的数字（可以有一位小数）
    }
  ]
}`;

export async function generateBrandMatches(film: string): Promise<BrandMatch[]> {
  const raw = await callLlm(
    BRAND_SYSTEM,
    `电影名：${film}。请给出 6 个适合联名的品牌，按匹配度从高到低排序。`,
  );
  const parsed = safeJsonFromText(raw) as { matches?: BrandMatch[] } | null;
  if (parsed && Array.isArray(parsed.matches) && parsed.matches.length) {
    return parsed.matches;
  }
  throw new Error('AI 输出解析失败');
}

const COMPETITOR_SYSTEM = `你是娱乐行业竞品联名分析师。用户给出一部电影名作为参考，你输出 5 条最近迪士尼、华纳、派拉蒙、索尼等竞品工作室的品牌联名动态，用于 NBCUniversal 团队做对比参考。严格返回 JSON，格式如下：
{
  "activities": [
    {
      "date": "月份 年份，如 Aug 2026",
      "status": "Live In-Market / Completed / Upcoming Announcement 三选一",
      "campaignType": "联名类型短标签",
      "alignment": "资源类型，如 Theatrical Alignment",
      "studio": "出品工作室名",
      "partnership": "工作室 · 电影 × 品牌",
      "summary": "2-3 句话说清楚联名做了什么",
      "mediaEstimate": "媒体影响数值",
      "physicalDistribution": "线下触达数据",
      "takeawayTitle": "对 NBCU 的启示小标题，大写",
      "takeaway": "1-2 句话说这个联名对我们 NBCU 有什么借鉴意义",
      "imageKeyword": "1个短语，描述这张联名的视觉关键词"
    }
  ]
}`;

export async function generateCompetitorActivities(film: string): Promise<CompetitorActivity[]> {
  const raw = await callLlm(
    COMPETITOR_SYSTEM,
    `参考 NBCU 电影《${film}》的档期和类型，输出 5 条竞品工作室最近或即将进行的品牌联名动态。`,
  );
  const parsed = safeJsonFromText(raw) as { activities?: CompetitorActivity[] } | null;
  if (parsed && Array.isArray(parsed.activities) && parsed.activities.length) {
    return parsed.activities;
  }
  throw new Error('AI 输出解析失败');
}

const PITCH_SYSTEM = `你是 NBCU Partnerships 团队的提案策划。用户给出"电影 × 品牌"组合，输出一份结构完整、可以直接给合作品牌看的 Pitch 大纲。严格按以下 JSON 返回：
{
  "targetDemographic": {
    "primary": "主要人群一句话",
    "secondary": "次要人群一句话",
    "affinity": 80到99之间的数字（可以有一位小数）
  },
  "strategicFit": "两三句话说清这次联名的战略亮点和整体机会",
  "sections": [
    { "title": "Section 标题", "subtitle": "可选，英文子标题", "points": ["要点1", "要点2", "要点3"] }
  ],
  "hashtags": ["话题1", "话题2"],
  "totalFootprint": "总共触达范围一句话，例如 1,400+ 门店"
}
sections 必须恰好 4 条，顺序固定为：合作亮点 / 周边产品 / 社媒话题 / 线下活动。`;

export async function generatePitchProposal(
  film: string,
  brand: string,
): Promise<PitchProposal> {
  const raw = await callLlm(
    PITCH_SYSTEM,
    `电影：${film}\n品牌合作方：${brand}\n\n请生成完整的联名提案大纲，sections 顺序必须是：合作亮点 Why It Works、周边产品 Co-Branded Merch、社媒话题 Social Campaign、线下活动 Theater & Retail Experience。`,
  );
  const parsed = safeJsonFromText(raw) as PitchProposal | null;
  if (parsed && Array.isArray(parsed.sections) && parsed.sections.length >= 3) {
    return parsed;
  }
  throw new Error('AI 输出解析失败');
}

export const DEFAULT_BRAND_MATCHES: BrandMatch[] = FALLBACK_BRAND_MATCHES;
export const DEFAULT_COMPETITOR_ACTIVITIES: CompetitorActivity[] = COMPETITOR_ACTIVITIES;
export const DEFAULT_PITCH: PitchProposal = FALLBACK_PITCH;
