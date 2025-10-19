# FlowRSS - Project Structure

## Directory Layout

```
flowrss/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (optional)
│   │   ├── (main)/            # Main app routes
│   │   ├── api/               # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── feed/             # Feed-related components
│   │   ├── reader/           # Reader UI components
│   │   └── layout/           # Layout components
│   ├── lib/                   # Core libraries
│   │   ├── db/               # IndexedDB (Dexie)
│   │   ├── rss/              # RSS parsing & fetching
│   │   ├── ai/               # AI integrations
│   │   ├── supabase/         # Supabase client
│   │   └── utils/            # Utilities
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand stores
│   ├── types/                 # TypeScript types
│   └── config/                # Configuration
├── public/                    # Static assets
├── supabase/                  # Supabase migrations
└── docs/                      # Documentation
```

## Core Modules

### 1. Feed Management
- Feed CRUD operations
- OPML import/export
- Feed health monitoring
- Curated feed packs

### 2. Article Processing
- RSS parsing (rss-parser)
- Full-text extraction (@mozilla/readability)
- Content sanitization
- Offline caching

### 3. Storage Layer
- IndexedDB (Dexie.js) for local-first
- Supabase for optional cloud sync
- Conflict resolution

### 4. Reader UI
- Clean reading experience
- Theme support (light/dark/sepia)
- Typography controls
- Gesture navigation

### 5. AI Features (V3)
- Article summaries (OpenRouter)
- Smart search (Perplexity)
- Content recommendations

## Development Priorities

**Week 1-2:** Core infrastructure
- Next.js setup + Tailwind
- IndexedDB schema
- RSS parser + full-text extraction
- Basic UI components

**Week 3-4:** MVP features
- Feed management UI
- Reader interface
- OPML import/export
- Curated packs
- Optional Supabase sync

**Week 5+:** Enhancements & monetization
