# FlowRSS Architecture

## Overview

FlowRSS is built as a **local-first, privacy-focused** RSS reader with optional cloud sync capabilities. The architecture prioritizes offline functionality, performance, and user privacy.

## Core Principles

1. **Local-First**: All data stored locally in IndexedDB by default
2. **Privacy-First**: No tracking, optional signup, minimal data collection
3. **Offline-First**: Full functionality without internet connection
4. **Progressive Enhancement**: Cloud sync and AI features are optional
5. **Performance**: Fast loading, efficient caching, optimized rendering

## Technology Stack

### Frontend
- **Next.js 14** (App Router) - React framework with SSR/SSG
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible component library

### State Management
- **Zustand** - Lightweight state management
- **React Query** - Server state and caching
- **Dexie.js** - IndexedDB wrapper with React hooks

### Data Layer
- **IndexedDB** - Local storage (primary)
- **Supabase** - Cloud sync (optional)
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions

### RSS Processing
- **rss-parser** - RSS/Atom feed parsing
- **@mozilla/readability** - Full-text extraction
- **jsdom** - HTML parsing for content extraction

### AI Integration
- **OpenRouter** - AI summaries (Gemini models)
- **Perplexity** - Smart search and recommendations

## Data Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         React Components            │
│  (UI Layer - Next.js App Router)    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│      State Management Layer         │
│   (Zustand + React Query)           │
└──────┬──────────────────────────────┘
       │
       ├──────────────┬─────────────────┐
       ▼              ▼                 ▼
┌──────────┐   ┌──────────┐    ┌──────────┐
│ IndexedDB│   │ Supabase │    │ RSS APIs │
│ (Dexie)  │   │(Optional)│    │ (Feeds)  │
└──────────┘   └──────────┘    └──────────┘
```

## Database Schema

### IndexedDB (Dexie)

```typescript
// Feeds table
{
  id: string (UUID)
  url: string
  title: string
  description?: string
  category?: string
  imageUrl?: string
  isActive: boolean
  errorCount: number
  lastFetched?: Date
  createdAt: Date
  updatedAt: Date
}

// Articles table
{
  id: string (UUID)
  feedId: string (FK)
  title: string
  link: string
  description?: string
  content?: string
  fullContent?: string
  author?: string
  pubDate?: Date
  isRead: boolean
  isStarred: boolean
  isSaved: boolean
  createdAt: Date
  updatedAt: Date
}

// Settings table
{
  id: 'default'
  theme: 'light' | 'dark' | 'sepia' | 'system'
  fontSize: 'small' | 'medium' | 'large'
  syncEnabled: boolean
  lastSyncAt?: Date
  ...preferences
}
```

### Supabase (PostgreSQL)

```sql
-- feeds table
CREATE TABLE feeds (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_fetched TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- user_settings table
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  theme TEXT,
  font_size TEXT,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Module Architecture

### 1. RSS Module (`src/lib/rss/`)

**Responsibilities:**
- Parse RSS/Atom feeds
- Extract full-text content
- Fetch and update feeds
- Handle feed errors

**Key Files:**
- `parser.ts` - RSS parsing logic
- `extractor.ts` - Full-text extraction
- `fetcher.ts` - Feed fetching and updates

### 2. Database Module (`src/lib/db/`)

**Responsibilities:**
- IndexedDB schema and operations
- CRUD operations for feeds/articles
- Data migrations

**Key Files:**
- `schema.ts` - Dexie schema and operations

### 3. Sync Module (`src/lib/supabase/`)

**Responsibilities:**
- Cloud sync logic
- Conflict resolution
- Authentication

**Key Files:**
- `client.ts` - Supabase client
- `sync.ts` - Sync operations

### 4. AI Module (`src/lib/ai/`)

**Responsibilities:**
- Article summarization
- Smart search
- Content recommendations

**Key Files:**
- `openrouter.ts` - AI summaries
- `perplexity.ts` - Smart search

### 5. UI Components (`src/components/`)

**Structure:**
- `ui/` - Base components (Button, Card, Input)
- `layout/` - Layout components (Sidebar, Header)
- `feed/` - Feed-related components
- `reader/` - Article reader components

## Performance Optimizations

### 1. Lazy Loading
- Code splitting with Next.js dynamic imports
- Lazy load article content
- Virtual scrolling for large lists

### 2. Caching
- React Query for API caching
- IndexedDB for persistent storage
- Service Worker for offline assets

### 3. Batch Operations
- Bulk article inserts
- Batch feed updates
- Debounced search

### 4. Optimistic Updates
- Instant UI feedback
- Background sync
- Rollback on errors

## Security Considerations

### 1. Content Security
- Sanitize HTML content
- Remove dangerous scripts
- CSP headers

### 2. Privacy
- No third-party tracking
- Local-first by default
- Optional cloud sync
- Encrypted sync (future)

### 3. API Security
- Rate limiting
- API key rotation
- Secure environment variables

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables
- Set in Vercel dashboard
- Or use `.env.local` for development

## Monitoring & Analytics

### Privacy-First Analytics
- Plausible (optional)
- No personal data collection
- Aggregated metrics only

### Error Tracking
- Sentry (optional)
- Client-side errors
- Performance monitoring

## Future Enhancements

### V2
- Rule-based filtering
- Feed health monitoring
- Smart notifications
- Enhanced offline mode

### V3
- AI summaries
- Full-text search
- Web-to-RSS conversion
- Analytics dashboard

### V4
- Team collaboration
- API access
- Integrations (Zapier, n8n)
- Enterprise features

## Development Workflow

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## Testing Strategy

### Unit Tests
- Component testing (Jest + React Testing Library)
- Utility function tests
- Database operation tests

### Integration Tests
- RSS parsing and fetching
- Sync operations
- Full user flows

### E2E Tests
- Playwright for critical paths
- Feed management
- Article reading
- OPML import/export

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.
