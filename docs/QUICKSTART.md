# FlowRSS - Quick Start Guide ⚡

Get FlowRSS running in **under 5 minutes**!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)

## Installation

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./scripts/setup.sh

# Start development server
npm run dev
```

### Option 2: Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start development server
npm run dev
```

## Open the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Steps

### 1. Welcome Screen
- Choose from curated feed packs (Tech News, Dev Blogs, etc.)
- Or add your own RSS feed URL
- Click "Continue"

### 2. Start Reading
- Browse articles in the main feed
- Click any article to read
- Star articles you like
- Feeds update automatically

### 3. Customize (Optional)
- Click Settings to change theme
- Adjust font size and reading preferences
- Import OPML from your current reader

## Key Features

### ✅ Works Offline
- All data stored locally
- No internet required after initial setup
- Fast and reliable

### ✅ Privacy-First
- No tracking
- No signup required
- Your data stays on your device

### ✅ Full-Text Articles
- Complete articles, not just snippets
- Clean reading experience
- No ads or distractions

## Common Tasks

### Add a Feed
1. Click "Add Feed" in sidebar
2. Enter RSS feed URL
3. Click "Add"

### Import OPML
1. Go to Settings
2. Click "Import OPML"
3. Select your OPML file
4. All feeds imported!

### Export OPML
1. Go to Settings
2. Click "Export OPML"
3. Save file for backup

### Change Theme
1. Go to Settings
2. Select Light, Dark, or Sepia
3. Changes apply instantly

## Keyboard Shortcuts

- `j` / `k` - Navigate articles
- `o` - Open article
- `s` - Star article
- `r` - Refresh feeds
- `?` - Show all shortcuts

## Optional: Cloud Sync

Want to sync across devices?

1. Get free Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy Project URL and API key
4. Add to `.env` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
5. Restart dev server
6. Sign up in FlowRSS
7. Your feeds sync automatically!

## Optional: AI Features

Want AI summaries and smart search?

1. Get OpenRouter API key at [openrouter.ai](https://openrouter.ai)
2. Get Perplexity API key at [perplexity.ai](https://perplexity.ai)
3. Add to `.env` file:
   ```env
   OPENROUTER_API_KEY=your_key
   PERPLEXITY_API_KEY=your_key
   ```
4. Restart dev server
5. AI features now available!

## Troubleshooting

### Port 3000 in use?
```bash
PORT=3001 npm run dev
```

### Module not found?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors?
```bash
npm run type-check
```

### Still stuck?
- Check [INSTALL.md](INSTALL.md) for detailed guide
- Open an issue on GitHub
- Join our Discord community

## What's Next?

- ✅ Add your favorite feeds
- ✅ Import OPML from current reader
- ✅ Customize theme and settings
- ✅ Try keyboard shortcuts
- ✅ Enable cloud sync (optional)
- ✅ Explore AI features (optional)

## Learn More

- **README.md** - Project overview
- **INSTALL.md** - Detailed installation
- **ARCHITECTURE.md** - Technical details
- **TODO.md** - Development roadmap
- **LAUNCH_PLAN.md** - Marketing strategy

## Need Help?

- 📧 Email: hello@flowrss.app
- 💬 Discord: discord.gg/flowrss
- 🐦 Twitter: @flowrss
- 🐛 Issues: github.com/yourusername/flowrss/issues

---

**Happy reading! 📚**

Built with ❤️ for the RSS community
