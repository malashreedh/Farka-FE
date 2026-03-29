# Farka Frontend
farka-fe.vercel.app

Frontend for **FARKA** — a Nepal-first return planning platform built for Team 72 at the Nepal-US Hackathon 2026.

FARKA helps Nepali workers abroad understand what is realistically possible back home in Nepal, then guides them toward either a job opportunity or a small-business plan — through a conversational AI interface available in both **English and Nepali**.

---

## What It Does

Users chat with an AI assistant that collects their background (trade, district, savings, experience) and generates one of two outcomes:

- **Job Matches** — ranked job opportunities in Nepal based on experience, district demand, and trade skills, visualized on an interactive map
- **Business Roadmap** — a week-by-week Kanban checklist to launch a small business, paired with a financial viability analysis across 3 business options

The entire experience is bilingual. The app auto-detects Nepali text and switches the UI language accordingly. Voice input (Nepali or English) is also supported.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Maps | Leaflet + React Leaflet |
| Fonts | Geist (via `next/font`) |
| Backend | REST API on Render (`farka-be.onrender.com`) |

---

## Project Structure

```
app/
  page.tsx                  # Landing page with hero, features, CTA
  chat/page.tsx             # Main chat interface (multi-stage AI conversation)
  results/jobs/page.tsx     # Job match results with interactive map
  results/business/page.tsx # Business roadmap (Kanban checklist + financial panel)
  layout.tsx                # Root layout with LanguageProvider and Navbar

components/
  Navbar.tsx                # Fixed header with navigation and language toggle
  ChatBubble.tsx            # Message display for user and assistant messages
  LanguageProvider.tsx      # Global context for EN/NE language state
  LanguageToggle.tsx        # Button to switch between English and Nepali
  LoadingState.tsx          # Centered loading spinner
  ProfileProgressCard.tsx   # Sidebar progress tracker for chat workflow stages
  QuickActions.tsx          # Button group for path/district/savings selection
  SkillTag.tsx              # Toggle button for skill selection
  VoiceWaveform.tsx         # Animated waveform for voice recording/playback
  FinancialViabilityPanel.tsx  # 3-option business cost & break-even analysis
  JobDensityMap.tsx         # Leaflet map showing job density by district/trade
  ResultsFollowUpChat.tsx   # Embedded follow-up chat on results pages

lib/
  api.ts                    # All API calls to the backend (fetch wrapper)
  types.ts                  # TypeScript interfaces matching backend models
  language.ts               # All EN/NE UI strings and getText() helper
  workflows.ts              # Domain options, district/savings/path action configs
  nepalGeo.ts               # District coordinates and trade color map for Leaflet
```

---

## Pages

### `/` — Landing
Introduces FARKA with a hero section, feature highlights, and a call-to-action to start the chat. Fully bilingual.

### `/chat` — Chat Interface
The core of the app. A multi-stage conversation that collects:
1. Language preference (auto-detected)
2. Basic info (name, country of work, years abroad)
3. Trade/domain background
4. Path choice: job search or business plan
5. Skills and district
6. Savings and business idea (if business path)

Supports text input and voice recording (Nepali or English). Displays a live profile progress sidebar.

### `/results/jobs` — Job Matches
Shows ranked job opportunities with match scores. Includes an interactive Leaflet map of Nepal filtered by trade category and district demand.

### `/results/business` — Business Roadmap
Displays a Kanban board of weekly tasks to launch a business. Each card is togglable for progress tracking. Includes a financial viability panel with cost estimates, break-even timelines, and risk levels for 3 business options.

---

## Setup

### Prerequisites

- Node.js 18+
- npm

### 1. Clone the repo

```bash
git clone https://github.com/malashreedh/Farka-FE.git
cd Farka-FE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```env
# For local development (if running backend locally)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# For connecting to the deployed backend
NEXT_PUBLIC_API_BASE_URL=https://farka-be.onrender.com/api/v1
```

> The `NEXT_PUBLIC_` prefix is required — Next.js only exposes env vars with this prefix to the browser.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

```bash
npm run dev      # Start development server (hot reload on localhost:3000)
npm run build    # Build for production
npm start        # Start production server (run build first)
npm run lint     # Run ESLint
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API base URL including `/api/v1`. Falls back to `https://farka-be.onrender.com/api/v1` if not set. |

---

## Backend

The frontend connects to a separate backend service. The backend handles:
- Chat session management (`/chat/start`, `/chat/message`, `/chat/voice-message`)
- Profile storage and retrieval (`/profile/:id`)
- Job matching (`/jobs/match`, `/jobs/matches/:id`)
- Business checklist generation and toggling (`/business/checklist`)
- Financial viability analysis (`/business/viability`)

Backend repo: [malashreedh/Farka-BE](https://github.com/malashreedh/Farka-BE) — deployed on Render.

---

## Language Support

The app is fully bilingual in **English** and **Nepali (नेपाली)**.

- Language is auto-detected from user input (Nepali Unicode characters `\u0900–\u097F`)
- Users can toggle language manually via the navbar button
- Preference is saved to `localStorage`
- Voice input accepts both languages; the backend transcribes and responds accordingly
- All UI strings are in `lib/language.ts`

---

## Deployment

The app is built with Next.js and can be deployed to any platform that supports Node.js.

**Vercel (recommended):**
1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add `NEXT_PUBLIC_API_BASE_URL` as an environment variable in the Vercel project settings
4. Deploy

**Other platforms (Render, Railway, etc.):**
```bash
npm run build
npm start
```
