# PartnerMatch AI

> 为申请 **NBCUniversal Partnerships Intern（品牌合作实习生）** 制作的求职展示项目。
> 一句话定位：**NBCU 电影 × 品牌联名合作智能推荐与 Pitch 辅助工具**。

技术栈：**React 18 + TypeScript + Vite + Tailwind CSS**（纯前端，静态部署，无后端）。

视觉风格：参考 iPhone / Apple 官网的**简洁、高级、专业、清爽白底**，统一大留白、轻细边界、单一柔和强调蓝（详见「视觉表达卡 v1」与项目记录）。

---

## 一、项目包含的三个核心功能（全部命中 JD）

| 功能 | 做什么 | 对应 JD 原话 |
| --- | --- | --- |
| **Brand Matching · 品牌匹配** | 输入任意电影名，AI 实时推荐 6 个最适合联名的品牌（含匹配度、合作理由、数据指标） | `Research potential partners for film specific promotions` |
| **Competitor Tracker · 竞品动态** | 展示 Disney / Warner Bros. / Paramount / Sony 等竞品工作室最近做了哪些联名，每条都附 `NBCU 反制启示` | `Research competitor brand partnership programs and prepare competitor reports` |
| **Proposal Generator · 提案生成** | 选定「电影 × 品牌」后，一键生成分 4 个 section 的完整 Pitch 大纲（合作亮点/周边/社媒/线下） | `Sourcing leads and contacts at brands to refine pitch lists to the Partnerships team` |

共用结构：
- 顶部导航栏（三功能切换 + LLM 配置状态角标）
- 左侧栏：Quick Pick · 5 部 NBCU 热门影片（点一下自动填入输入框）
- 底部栏：Industry Pulse · 近期联名资讯 3 张小卡片

---

## 二、本地启动（只要装好 Node.js 就能跑）

### 1. 安装 Node.js（如果还没装）
macOS 推荐：
```bash
# 先装 Homebrew（如果还没装），然后：
brew install node
```
装完执行 `node -v` 和 `npm -v`，能看到版本号就算好了（Node ≥ 18 就行）。

### 2. 安装项目依赖
在项目根目录 `/Users/rinkor/Desktop/test` 打开终端：
```bash
cd /Users/rinkor/Desktop/test
npm install
```

### 3. 配置 LLM API Key（**可选，不配置也能跑，会显示占位示例**）
把根目录下的 `.env.example` 复制一份命名为 `.env`：
```bash
cp .env.example .env
```
然后打开 `.env` 填 Key，目前支持 **OpenAI** 和 **Google Gemini** 二选一：

**方案 A：用 OpenAI（推荐 gpt-4o-mini，性价比高）**
```env
VITE_LLM_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-你的真实key
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_OPENAI_BASE_URL=          # 如果需要自建/代理就填，否则留空用官方
```

**方案 B：用 Google Gemini（免费额度更高）**
```env
VITE_LLM_PROVIDER=gemini
VITE_GOOGLE_GEMINI_API_KEY=你的真实key
VITE_GOOGLE_GEMINI_MODEL=gemini-1.5-flash
```

> ⚠️ `.env` 里的 Key **只在你本机使用**，已经被 `.gitignore` 排除，不会被打包或提交。

### 4. 启动本地预览
```bash
npm run dev
```
终端会显示类似 `Local: http://localhost:5173/`，在浏览器打开这个地址即可。

### 5. 构建生产版本（用于部署）
```bash
npm run build
```
产物会输出到 `dist/` 目录，整个 `dist/` 是纯静态文件，可以直接部署。

### 6. 本地预览构建后的真实版本
```bash
npm run preview
```

### 7. TypeScript 类型检查
```bash
npm run typecheck
```

---

## 三、Vercel 手动部署（按 Workshop 规则由你手动操作）

本项目是标准 Vite + React 静态项目，Vercel 零配置即可识别：

1. 在 Vercel 网站登录你的账号
2. 点 **Add New → Project**，把当前本地项目目录 `/Users/rinkor/Desktop/test` 对应的 Git 仓库（GitHub / GitLab 都行）授权给 Vercel（或者先把项目推到 GitHub）
3. 导入项目后，在 **Configure Project** 页面：
   - **Framework Preset** 会自动识别成 `Vite`，保持默认
   - **Build Command**：默认 `npm run build`（不需要改）
   - **Output Directory**：默认 `dist`（不需要改）
   - **Environment Variables**（关键！）：把上面第二步里写进 `.env` 的那些变量（例如 `VITE_LLM_PROVIDER`、`VITE_OPENAI_API_KEY` 等）**一条一条手动填到 Vercel 的 Environment Variables 里**（别忘了勾选 Production / Preview / Development）
4. 点 **Deploy**，等 1–2 分钟构建完成
5. 部署完 Vercel 会给你一个线上地址（类似 `https://xxx.vercel.app`），打开检查三个功能是否正常显示、点击品牌匹配页的 `Use this brand →` 是否会跳到提案生成页并自动填入电影和品牌

> 💡 没配置 API Key 也可以部署，线上会显示占位示例，面试展示没问题；之后想演示"真 AI 效果"，再在 Vercel 项目的 Settings → Environment Variables 填上 Key，重新 Redeploy 一次即可。

---

## 四、内容是怎么存的（Workshop 约定：本地工程文件维护）

所有内容和示例数据都作为本地工程文件保存，后续你只要**用大白话告诉我"改什么"**，我直接改代码里的文件：

| 内容 | 文件位置 |
| --- | --- |
| 左侧栏电影（Quick Pick）、底部 Industry Pulse 资讯 | [src/data/content.ts](src/data/content.ts) |
| 品牌匹配、竞品动态、提案生成的占位示例数据（没配 Key 时展示这些） | [src/data/placeholder.ts](src/data/placeholder.ts) |
| 三功能实际调用 LLM 的逻辑（提示词、JSON 解析、OpenAI/Gemini 封装） | [src/lib/llm.ts](src/lib/llm.ts) |
| 共用组件（TopNav / Sidebar / PulseBar / LoadingSpinner / KpiTile） | [src/components/](src/components/) |
| 三个功能页 | [src/pages/](src/pages/) |
| 颜色、圆角、阴影、字体的统一视觉规则（视觉表达卡 v1） | [tailwind.config.js](tailwind.config.js) + [src/index.css](src/index.css) |

---

## 五、项目内资料（交接参考）

- 项目总规则与进度记录：[项目记录.md](项目记录.md)
- Sketch Draft 1（结构版本）导出图和参考 HTML：`stitch_extracted/stitch_partnermatch_ai_console/`
- 视觉表达卡 v1 图片占位（生图接口未返回成品，以文字版为准）：`visual_card_v1.jpg`

---

## 六、注意事项 / 已知边界

- **纯前端：** 不包含登录、数据库、服务端写入；不实现网页端"新增/上传/编辑/发布"内容的管理功能（Workshop 范围内不做）。
- **LLM Key 安全性：** Vite 把 `VITE_` 开头的变量直接打进前端包，意味着在浏览器 F12 能看到 Key。**求职展示项目没问题**，但如果以后要放公开链接给陌生人用，一定要自己加一个后端代理或使用 Vercel Edge Functions 代理请求，不要把真 Key 暴露在前端。
- **数据占位：** 项目里涉及的所有品牌名（NYX、Starbucks、Target 等）、电影名（Wicked、Despicable Me 4 等）、联名案例都是示例，不代表真实合作关系。
