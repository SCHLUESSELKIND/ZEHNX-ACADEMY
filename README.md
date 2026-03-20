# ZEHNX ACADEMY

**Verzehnfache dein Wissen.**

Die freie AI Sprint-Akademie. Keine Kurse — Sprints an deinem echten Projekt mit sofort sichtbaren Ergebnissen.

## Was ist ZEHNX?

ZEHNX ACADEMY ist eine projektbasierte AI-Lernplattform die den Weiterbildungsmarkt disruptiert. Statt generischer Kurse lernen User AI durch Sprints an ihren echten Projekten — von Anfänger (A1) bis Experte (C2).

### Core Features

- **Sprint-System**: 3-5 Tage Sprints mit 5 Phasen (Kickoff → Learn → Build → Reflect → Share)
- **Projekt-Import**: Beschreibe dein Projekt → AI generiert personalisierte Sprints
- **8 Departments**: Design, Apps, Chatbots, Automation, Content, Data, Business, Selbstschutz
- **Newsroom**: CNN-Style Live-Ticker mit kuratierten AI-News + Ressourcen
- **Deep Dive**: 4-Layer Tiefensystem (Oberfläche → Vertiefung → Expertise → Research)
- **Collective Brain**: Alle lernen von allen — privacy-preserving Pattern Extraction
- **Skill Stacking**: Wissensbaum wächst organisch über Sprints
- **Enterprise Edition**: Personengenaue Sprints am Tagesgeschäft, EU AI Act konform
- **6 Sprachniveaus**: A1-C2 adaptive Erklärungen

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React (Vite), PWA |
| Backend | Supabase (Self-hosted, Hetzner) |
| Auth | Supabase Auth (Magic Link + OAuth) |
| Hosting | Vercel (Frontend), Hetzner (Backend) |
| AI | Claude API (via OpenRouter Fallback) |
| Payments | Stripe (3-Tier Enterprise) |
| Automation | n8n (News Crawler, Reminders) |
| SMTP | IONOS |
| Analytics | Plausible (self-hosted) |

## Quick Start

```bash
# Clone
git clone https://github.com/zehnx/academy.git
cd academy

# Install
npm install

# Configure
cp .env.template .env
# → Fill in Supabase URL, Keys, etc.

# Develop
npm run dev

# Deploy Supabase schema
psql -h your-host -U postgres -f supabase/migrations/001_initial_schema.sql
psql -h your-host -U postgres -f supabase/migrations/002_seed_sprints.sql

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Project Structure

```
zehnx/
├── public/               # Static assets, PWA icons
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/
│   │   └── useAuth.jsx   # Auth context + hooks
│   ├── lib/
│   │   ├── supabase.js   # Supabase client
│   │   └── api.js        # All database operations
│   ├── pages/            # Route-level components
│   ├── data/             # Static data, assessment questions
│   ├── App.jsx           # Main app with routing
│   └── main.jsx          # Entry point
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  # Complete DB schema
│       └── 002_seed_sprints.sql    # Sprint templates
├── config/               # Deployment configs
├── .env.template         # Environment variables template
├── DEPLOYMENT.md         # Full deployment guide
├── vite.config.js        # Vite + PWA config
└── package.json
```

## Database Schema

- **profiles**: User data, skill level, streak, organization link
- **organizations**: Enterprise accounts, SSO, compliance
- **departments**: 8 learning departments
- **sprint_templates**: Sprint catalog (25+ templates)
- **user_sprints**: Active/completed sprint instances
- **skills / user_skills**: Skill tree with XP tracking
- **assessments**: Skill assessment results
- **news_items / ticker_items**: Newsroom content
- **deep_dive_content**: Multi-layer deep dive material
- **collective_patterns**: Privacy-preserving crowdsourced learnings
- **compliance_logs**: EU AI Act Art. 4 audit trail
- **daily_activity**: Streak and engagement tracking

Full schema with RLS policies, functions, triggers, and indexes included.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide:
- Supabase on Hetzner (~€7.49/mo)
- Frontend on Vercel (~€20/mo)
- Total: ~€50-80/mo

## Enterprise Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | €0 | All sprints, all departments |
| Starter | €9/seat/mo | Team sprints, reporting |
| Professional | €19/seat/mo | Projekt-Import, SSO, Admin |
| Enterprise | Custom | White-label, SCIM, Success Manager |

## License

Proprietary — Frerich United Ventures GmbH, Köln

## Kontakt

- **Web**: zehnx.de
- **Email**: hi@zehnx.de
- **GmbH**: Frerich United Ventures GmbH, An der Ronne 48, 50859 Köln
- **USt-IdNr**: DE 356752511
