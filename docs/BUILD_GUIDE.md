# FlowRSS - Complete Build Guide 🏗️

This guide will take you from zero to a fully functional FlowRSS installation.

---

## 🎯 What You're Building

FlowRSS is a privacy-first, offline-first RSS reader with:
- Local-first storage (IndexedDB)
- Full-text article extraction
- Optional cloud sync (Supabase)
- Optional AI features (OpenRouter, Perplexity)
- Clean, distraction-free reading experience

---

## 📋 Prerequisites

### Required
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm 9+** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Code editor** - VS Code recommended

### Optional (for cloud features)
- **Supabase account** - [Sign up](https://supabase.com/)
- **OpenRouter API key** - [Get key](https://openrouter.ai/)
- **Perplexity API key** - [Get key](https://perplexity.ai/)

---

## 🚀 Step-by-Step Build

### Step 1: Verify Prerequisites

```bash
# Check Node.js version (should be 18+)
node -v

# Check npm version (should be 9+)
npm -v

# Check Git
git --version
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install
```

This installs:
- Next.js 14 (React framework)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Dexie.js (IndexedDB wrapper)
- rss-parser (RSS parsing)
- @mozilla/readability (content extraction)
- And more...

### Step 3: Set Up Environment

```bash
# Copy environment template
cp .env.example .env
```

Your `.env` file should look like this:

```env
# Supabase (optional - for cloud sync)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# OpenRouter (optional - for AI summaries)
OPENROUTER_API_KEY=

# Perplexity (optional - for smart search)
PERPLEXITY_API_KEY=
```

**Note:** Leave these empty for now. FlowRSS works perfectly without them!

### Step 4: Run Development Server

```bash
# Start the dev server
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### Step 5: Open in Browser

Open [http://localhost:3000](http://localhost:3000)

You should see the FlowRSS welcome screen! 🎉

---

## 🎨 First-Time Setup

### 1. Welcome Screen

When you first open FlowRSS, you'll see:
- Welcome message
- Feature highlights
- "Get Started" button

Click **"Get Started"**

### 2. Choose Feeds

You'll see curated feed packs:
- 💻 Tech News
- 👨‍💻 Developer Blogs
- ₿ Crypto & Web3
- 🎨 Design & UX
- 🤖 AI & Machine Learning
- ⚡ Productivity & Life
- 🚀 Indie Hackers

**Select one or more packs** by clicking on them.

Or **add a custom feed** by entering an RSS URL.

Click **"Continue"**

### 3. Start Reading!

You'll now see:
- **Sidebar** - Your feeds
- **Article list** - Latest articles
- **Reader** - Click any article to read

---

## 🔧 Optional: Cloud Sync Setup

Want to sync across devices? Set up Supabase:

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com/)
2. Click "New Project"
3. Fill in:
   - Project name: `flowrss`
   - Database password: (generate strong password)
   - Region: (choose closest to you)
4. Click "Create new project"
5. Wait 2-3 minutes for setup

### 2. Get API Keys

1. Go to **Project Settings** > **API**
2. Copy:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 3. Create Database Tables

1. Go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL:

```sql
-- Feeds table
CREATE TABLE feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
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

-- Enable Row Level Security
ALTER TABLE feeds ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own feeds"
  ON feeds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feeds"
  ON feeds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feeds"
  ON feeds FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feeds"
  ON feeds FOR DELETE
  USING (auth.uid() = user_id);

-- User settings table
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  theme TEXT DEFAULT 'system',
  font_size TEXT DEFAULT 'medium',
  font_family TEXT DEFAULT 'sans',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);
```

4. Click **Run**

### 4. Add Keys to .env

Edit your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_key_here
```

### 5. Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

### 6. Sign Up in FlowRSS

1. Open FlowRSS
2. Click "Sign Up" (if you see it)
3. Enter email and password
4. Your feeds now sync to the cloud!

---

## 🤖 Optional: AI Features Setup

Want AI summaries and smart search?

### 1. Get OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai/)
2. Sign up / Log in
3. Go to **Keys**
4. Click **Create Key**
5. Copy the key (starts with `sk-or-v1-...`)

### 2. Get Perplexity API Key

1. Go to [perplexity.ai](https://perplexity.ai/)
2. Sign up / Log in
3. Go to **API**
4. Generate API key
5. Copy the key (starts with `pplx-...`)

### 3. Add Keys to .env

Edit your `.env` file:

```env
OPENROUTER_API_KEY=sk-or-v1-...your_key_here
PERPLEXITY_API_KEY=pplx-...your_key_here
```

### 4. Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

### 5. Use AI Features

- **AI Summaries**: Click "Summarize" on any article
- **Smart Search**: Use the search bar with AI-powered results
- **Feed Discovery**: Ask for feed recommendations

---

## 🧪 Testing Your Build

### 1. Test Feed Management

- [ ] Add a feed manually
- [ ] Import OPML file
- [ ] Export OPML file
- [ ] Delete a feed
- [ ] Refresh feeds

### 2. Test Article Reading

- [ ] Click an article to read
- [ ] Star an article
- [ ] Mark as read/unread
- [ ] Change theme
- [ ] Adjust font size

### 3. Test Offline Mode

- [ ] Disconnect internet
- [ ] Browse articles (should work!)
- [ ] Read saved articles
- [ ] Reconnect internet
- [ ] Sync updates

### 4. Test Cloud Sync (if enabled)

- [ ] Sign up
- [ ] Add feeds
- [ ] Open in another browser
- [ ] Sign in
- [ ] Feeds should sync!

---

## 🐛 Troubleshooting

### "Port 3000 already in use"

```bash
# Use a different port
PORT=3001 npm run dev
```

### "Module not found" errors

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Type errors" during build

```bash
# Run type check
npm run type-check
```

### IndexedDB not working

- Clear browser data for localhost
- Try a different browser (Chrome/Firefox/Edge)
- Check browser console for errors

### Supabase connection fails

- Verify API keys are correct
- Check Supabase project is active
- Verify database tables are created
- Check browser console for errors

### AI features not working

- Verify API keys are correct
- Check API key has credits
- Verify environment variables are set
- Restart dev server after adding keys

---

## 📦 Building for Production

### 1. Type Check

```bash
npm run type-check
```

Fix any type errors.

### 2. Build

```bash
npm run build
```

This creates an optimized production build.

### 3. Test Production Build

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Follow the prompts. Your app will be live in minutes!

---

## 🎓 Next Steps

### Learn the Codebase

1. **Read the docs:**
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
   - [TODO.md](TODO.md) - Development roadmap
   - [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - Current status

2. **Explore the code:**
   - `src/lib/db/` - Database layer
   - `src/lib/rss/` - RSS processing
   - `src/components/` - UI components
   - `src/app/` - Next.js pages

3. **Make changes:**
   - Add a new feature
   - Fix a bug
   - Improve UI
   - Optimize performance

### Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Get Help

- 📧 Email: hello@flowrss.app
- 💬 Discord: discord.gg/flowrss
- 🐦 Twitter: @flowrss
- 🐛 Issues: github.com/yourusername/flowrss/issues

---

## 🎉 Congratulations!

You've successfully built FlowRSS! 🚀

You now have:
- ✅ A working RSS reader
- ✅ Local-first storage
- ✅ Full-text extraction
- ✅ Optional cloud sync
- ✅ Optional AI features
- ✅ Clean, modern UI

**What's next?**
- Add your favorite feeds
- Customize the experience
- Share with friends
- Contribute to the project
- Build something amazing!

---

**Happy reading! 📚**

Built with ❤️ for the RSS community
