# ═══════════════════════════════════════════════════════════════
# ZEHNX ACADEMY — Deployment Guide
# Hetzner (Supabase) + Vercel (Frontend)
# ═══════════════════════════════════════════════════════════════

## Architektur-Überblick

```
                    ┌─────────────┐
                    │   Vercel    │
                    │  (Frontend) │
                    │  zehnx.de   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
    ┌─────────▼──┐  ┌──────▼─────┐  ┌──▼──────────┐
    │  Supabase  │  │ Claude API │  │   Stripe    │
    │  (Hetzner) │  │ (Anthropic)│  │  (Payments) │
    │  CPX22     │  └────────────┘  └─────────────┘
    └────────────┘
```

## Phase 1: Supabase auf Hetzner

Du hast bereits einen Hetzner CPX22 mit Supabase laufen (sonnentaucher).
Für ZEHNX empfehle ich eine SEPARATE Supabase-Instanz.

### Option A: Zweite Instanz auf bestehendem Server

```bash
# Neues Verzeichnis
mkdir -p /opt/zehnx-supabase
cd /opt/zehnx-supabase

# Docker Compose von Supabase klonen
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# .env anpassen — ANDERE Ports als sonnentaucher
cp .env.example .env
nano .env

# Wichtige Änderungen:
# STUDIO_PORT=3100 (statt 3000)
# API_EXTERNAL_URL=https://supabase.zehnx.de
# SITE_URL=https://zehnx.de
# Neues POSTGRES_PASSWORD generieren
# Neues JWT_SECRET generieren
# Neues ANON_KEY generieren
# Neues SERVICE_ROLE_KEY generieren
```

### Option B: Separater Server (empfohlen für Production)

```bash
# Neuer Hetzner CPX22 (€7.49/mo)
# Vorteil: Isolierung, eigene Ressourcen, einfacheres Backup
```

### Caddy Config (Reverse Proxy)

```caddyfile
# /etc/caddy/Caddyfile — Block für ZEHNX hinzufügen

supabase.zehnx.de {
    reverse_proxy localhost:8000 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
    }
}

zehnx.de {
    # Vercel handles this, but if self-hosting:
    reverse_proxy localhost:3000
}
```

### Schema deployen

```bash
# Auf dem Server
cd /opt/zehnx-supabase

# Migration ausführen
psql -h localhost -U postgres -d postgres \
  -f /path/to/zehnx/supabase/migrations/001_initial_schema.sql

psql -h localhost -U postgres -d postgres \
  -f /path/to/zehnx/supabase/migrations/002_seed_sprints.sql
```

## Phase 2: Frontend auf Vercel

### Setup

```bash
# Lokal auf deinem Mac
cd ~/Projects/zehnx-academy

# Dependencies installieren
npm install

# .env erstellen
cp .env.template .env
# → Werte eintragen

# Lokal testen
npm run dev
```

### Vercel Deploy

```bash
# Vercel CLI
npm i -g vercel
vercel login

# Deployen
vercel

# Production deploy
vercel --prod

# Domain verbinden
vercel domains add zehnx.de
```

### Vercel Environment Variables

Im Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL = https://supabase.zehnx.de
VITE_SUPABASE_ANON_KEY = [dein anon key]
VITE_APP_URL = https://zehnx.de
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_...
```

## Phase 3: DNS Setup

Bei IONOS (oder deinem DNS-Provider):

```
zehnx.de          A     → Vercel IP (76.76.21.21)
zehnx.de          AAAA  → Vercel IPv6
www.zehnx.de      CNAME → cname.vercel-dns.com
supabase.zehnx.de A     → Hetzner Server IP
```

## Phase 4: SMTP (IONOS)

```bash
# Mailbox anlegen bei IONOS
# hi@zehnx.de

# In Supabase .env:
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=hi@zehnx.de
SMTP_PASS=[password]
SMTP_SENDER_NAME=ZEHNX ACADEMY
```

## Phase 5: Stripe

```bash
# Stripe Dashboard → Products erstellen:

# 1. ZEHNX Free
# Price: €0/mo

# 2. ZEHNX Enterprise Starter
# Price: €9/seat/mo
# Metadata: plan=starter, max_seats=50

# 3. ZEHNX Enterprise Pro
# Price: €19/seat/mo
# Metadata: plan=professional, max_seats=250

# 4. ZEHNX Enterprise Custom
# Kontaktformular

# Webhook einrichten:
# URL: https://supabase.zehnx.de/functions/v1/stripe-webhook
# Events: checkout.session.completed, customer.subscription.updated,
#          customer.subscription.deleted, invoice.payment_succeeded
```

## Phase 6: n8n News Crawler

```bash
# Auf Hetzner Server (oder separater n8n-Instanz)
# n8n läuft vermutlich schon für sonnentaucher

# Neuen Workflow erstellen: "ZEHNX News Crawler"
# Trigger: Cron - alle 15 Minuten

# Flow:
# 1. RSS Feed Read (multiple) → 50+ Sources
# 2. Merge → Deduplicate
# 3. Claude API → Relevanz + Kategorisierung + Summary
# 4. Supabase Insert → news_items Tabelle
# 5. If impact = 'critical' → Push Notification

# Separater Workflow: "ZEHNX Ticker Update"
# Trigger: Cron - alle 5 Minuten
# Flow: RSS → Claude → ticker_items
```

## Phase 7: Backup & Monitoring

```bash
# Backup Cron (täglich 3:00 Uhr)
# /etc/cron.d/zehnx-backup

0 3 * * * root pg_dump -h localhost -U postgres zehnx | \
  gzip > /backups/zehnx/zehnx_$(date +\%Y\%m\%d).sql.gz

# Cleanup (behalte 30 Tage)
0 4 * * * root find /backups/zehnx -mtime +30 -delete

# Monitoring: Uptime Kuma oder ähnliches
# Checks:
# - https://zehnx.de (Frontend)
# - https://supabase.zehnx.de/rest/v1/ (API)
# - SSL Zertifikate
```

## Checkliste vor Launch

- [ ] Domain zehnx.de registriert
- [ ] Supabase Instanz läuft auf Hetzner
- [ ] Schema + Seed-Daten deployed
- [ ] Frontend auf Vercel deployed
- [ ] DNS konfiguriert (A + CNAME Records)
- [ ] SSL Zertifikate aktiv (Caddy auto)
- [ ] SMTP funktioniert (Magic Link testen)
- [ ] Stripe Webhooks aktiv
- [ ] n8n News Crawler läuft
- [ ] Backup Cron aktiv
- [ ] Monitoring eingerichtet
- [ ] Impressum + Datenschutz Seiten live
- [ ] DSGVO: Cookie-Banner (minimal, nur Notwendige)
- [ ] AI Act: Transparenz-Seite

## Kosten-Übersicht (monatlich)

| Service           | Kosten    |
|-------------------|-----------|
| Hetzner CPX22     | €7.49     |
| Vercel Pro        | €20       |
| Domain zehnx.de   | ~€1       |
| IONOS SMTP        | €1        |
| Claude API        | ~€20-50   |
| Stripe            | 1.4% + €0.25 |
| **Gesamt**        | **~€50-80/mo** |
