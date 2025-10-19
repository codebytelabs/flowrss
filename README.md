# FlowRSS

> Your content, in flow.

FlowRSS is a privacy-first, offline-first RSS reader with AI-powered enhancements. Built with Next.js, TypeScript, and Supabase.

## ✨ Features

### V1 (MVP)
- ✅ **Local-first storage** - IndexedDB for offline reading
- ✅ **Full-text extraction** - Complete articles, not just snippets
- ✅ **OPML import/export** - Migrate from any RSS reader
- ✅ **Curated feed packs** - Instant value for new users
- ✅ **Clean reading UI** - Distraction-free experience
- ✅ **Theme support** - Light, dark, and sepia modes
- ✅ **Optional cloud sync** - Supabase integration
- ✅ **Privacy-first** - No tracking, no signup required

### Coming Soon (V2/V3)
- 🔜 AI summaries (OpenRouter/Perplexity)
- 🔜 Rule-based filtering
- 🔜 Feed health monitoring
- 🔜 Smart notifications
- 🔜 Full-text search
- 🔜 Web-to-RSS conversion

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🏗️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **State:** Zustand, React Query
- **Storage:** IndexedDB (Dexie.js)
- **Backend:** Supabase (optional)
- **RSS:** rss-parser, @mozilla/readability
- **AI:** OpenRouter (Gemini), Perplexity
- **Deployment:** Vercel

## 📁 Project Structure

```
flowrss/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/             # Core libraries
│   │   ├── db/          # IndexedDB (Dexie)
│   │   ├── rss/         # RSS parsing & fetching
│   │   ├── ai/          # AI integrations
│   │   └── supabase/    # Supabase client
│   ├── hooks/           # Custom hooks
│   ├── stores/          # Zustand stores
│   └── types/           # TypeScript types
├── public/              # Static assets
└── docs/                # Documentation
```

## 🔧 Configuration

### Environment Variables

```env
# Supabase (optional - for cloud sync)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key

# OpenRouter (optional - for AI summaries)
OPENROUTER_API_KEY=your_api_key
OPENROUTER_PRIMARY_MODEL=google/gemini-2.0-flash-lite-001

# Perplexity (optional - for smart search)
PERPLEXITY_API_KEY=your_api_key
```

## 📖 Usage

### Adding Feeds

1. Click "Add Feed" in the sidebar
2. Enter RSS feed URL
3. Or choose from curated packs

### Importing OPML

1. Go to Settings
2. Click "Import OPML"
3. Select your OPML file

### Keyboard Shortcuts

- `j/k` - Navigate articles
- `o` - Open article
- `s` - Star article
- `r` - Refresh feeds
- `?` - Show shortcuts

## 🎯 Roadmap

### Phase 1 - MVP (Weeks 1-4) ✅
- Core RSS reader functionality
- Local storage with IndexedDB
- OPML import/export
- Curated feed packs
- Clean reading UI

### Phase 2 - Enhanced (Weeks 5-8)
- Rule-based filtering
- Feed health monitoring
- Smart notifications
- Offline enhancements

### Phase 3 - AI & Advanced (Weeks 9-12)
- AI summaries
- Full-text search
- Web-to-RSS conversion
- Analytics dashboard

### Phase 4 - Monetization (Weeks 13+)
- Pro tier features
- Team collaboration
- API access
- Integrations

## 💰 Monetization

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Local feeds, OPML, offline-first |
| Pro | $5-8/mo | Filters, full-text, sync |
| Pro+ | $10-12/mo | AI summaries, search |
| Team | $20-25/mo | Collaboration, API |

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [rss-parser](https://github.com/rbren/rss-parser) - RSS parsing
- [Readability](https://github.com/mozilla/readability) - Content extraction
- [Dexie.js](https://dexie.org/) - IndexedDB wrapper
- [Supabase](https://supabase.com/) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - UI components

## 📧 Contact

- Website: [flowrss.app](https://flowrss.app)
- Twitter: [@flowrss](https://twitter.com/flowrss)
- Email: hello@flowrss.app

---

Built with ❤️ for the RSS community
