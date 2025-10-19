# FlowRSS Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

Optional:
- **Supabase account** (for cloud sync) - [Sign up](https://supabase.com/)
- **OpenRouter API key** (for AI summaries) - [Get key](https://openrouter.ai/)
- **Perplexity API key** (for smart search) - [Get key](https://www.perplexity.ai/)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/flowrss.git
cd flowrss
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Dexie (IndexedDB)
- RSS parser
- And more...

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys (optional):

```env
# Supabase (optional - for cloud sync)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# OpenRouter (optional - for AI summaries)
OPENROUTER_API_KEY=your_api_key

# Perplexity (optional - for smart search)
PERPLEXITY_API_KEY=your_api_key
```

**Note:** FlowRSS works perfectly fine without any API keys! Cloud sync and AI features are optional.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup (Optional)

If you want to enable cloud sync:

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/)
2. Click "New Project"
3. Fill in project details
4. Wait for project to be created

### 2. Get API Keys

1. Go to Project Settings > API
2. Copy the "Project URL" and "anon public" key
3. Add them to your `.env` file

### 3. Create Database Tables

Run these SQL commands in the Supabase SQL Editor:

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

-- Enable RLS
ALTER TABLE feeds ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own feeds
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

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own settings
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

## Production Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add your API keys

### Alternative: Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Type check
npm run type-check

# Clear Next.js cache
rm -rf .next
npm run build
```

### IndexedDB Issues

- Clear browser data for localhost
- Try a different browser
- Check browser console for errors

## Development Tips

### Hot Reload

Next.js automatically reloads when you save files. If it doesn't:

```bash
# Restart the dev server
npm run dev
```

### Type Checking

```bash
# Run TypeScript type checker
npm run type-check
```

### Code Formatting

```bash
# Format code (if you add Prettier)
npm run format
```

## Browser Support

FlowRSS works best on:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Note:** IndexedDB is required, so very old browsers won't work.

## Mobile Development

To test on mobile devices:

1. Find your local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Access from mobile:
   ```
   http://YOUR_IP:3000
   ```

## Docker (Optional)

If you prefer Docker:

```bash
# Build image
docker build -t flowrss .

# Run container
docker run -p 3000:3000 flowrss
```

## Getting Help

- **Documentation:** [docs.flowrss.app](https://docs.flowrss.app)
- **GitHub Issues:** [github.com/yourusername/flowrss/issues](https://github.com/yourusername/flowrss/issues)
- **Discord:** [discord.gg/flowrss](https://discord.gg/flowrss)
- **Email:** hello@flowrss.app

## Next Steps

After installation:

1. ✅ Add your first feeds
2. ✅ Import OPML from your current reader
3. ✅ Customize theme and settings
4. ✅ Try keyboard shortcuts
5. ✅ Enable cloud sync (optional)
6. ✅ Explore AI features (optional)

Happy reading! 📚
