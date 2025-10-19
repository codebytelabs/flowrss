# Onboarding Experience with Fediverse Feeds

## Updated Welcome Screen

### Current Curated Packs Display

The welcome screen now includes Fediverse packs prominently displayed alongside traditional RSS feeds.

---

## Visual Layout

### Curated Packs Grid

```
┌─────────────────────────────────────────────────────────────┐
│                    Welcome to FlowRSS!                       │
│              Choose feeds to get started                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 💻 Tech News │  │ 👨‍💻 Developer │  │ 🤖 AI & ML   │
│              │  │              │  │              │
│ 5 feeds      │  │ 5 feeds      │  │ 5 feeds      │
│ ⭐ Popular   │  │ ⭐ Popular   │  │ ⭐ Popular   │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 🎨 Design    │  │ 🚀 Business  │  │ 🐘 Fediverse │  ← NEW!
│              │  │              │  │   Mastodon   │
│ 5 feeds      │  │ 5 feeds      │  │ 7 feeds      │
│ ⭐ Popular   │  │ ⭐ Popular   │  │ ⭐ Popular   │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 🦊 Fediverse │  │ 🌐 Fediverse │  │ ₿ Crypto     │
│   Lemmy      │  │   Mixed      │  │              │
│ 7 feeds      │  │ 6 feeds      │  │ 4 feeds      │
│ ⭐ Popular   │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
     ↑ NEW!            ↑ NEW!

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 🌍 News      │  │ 🔬 Science   │  │ 📚 Culture   │
│              │  │              │  │              │
│ 5 feeds      │  │ 5 feeds      │  │ 5 feeds      │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Fediverse Pack Details

### 🐘 Fediverse - Mastodon Pack

**When user clicks:**

```
┌─────────────────────────────────────────────────────────────┐
│  🐘 Fediverse - Mastodon                          [Subscribe]│
│                                                               │
│  Decentralized social media feeds from Mastodon instances    │
│  7 feeds • Popular                                            │
└─────────────────────────────────────────────────────────────┘

✓ Mastodon Official (@Gargron)
  Updates from the Mastodon creator
  mastodon.social/@Gargron.rss

✓ Mozilla on Fosstodon
  Firefox and open source updates
  fosstodon.org/@mozilla.rss

✓ #OpenSource on Mastodon
  Open source discussions
  mastodon.social/tags/opensource.rss

✓ #Privacy on Mastodon
  Privacy and security topics
  mastodon.social/tags/privacy.rss

✓ #Technology on TechHub
  Tech discussions from TechHub
  techhub.social/tags/technology.rss

✓ #Programming on Hachyderm
  Programming community
  hachyderm.io/tags/programming.rss

✓ #Linux on Fosstodon
  Linux and FOSS community
  fosstodon.org/tags/linux.rss

┌─────────────────────────────────────────────────────────────┐
│  💡 Tip: You can add any Mastodon account by adding .rss    │
│     to the profile URL!                                      │
│                                                               │
│     Example: mastodon.social/@username.rss                   │
└─────────────────────────────────────────────────────────────┘

[Cancel]                                    [Subscribe to All]
```

### 🦊 Fediverse - Lemmy Pack

**When user clicks:**

```
┌─────────────────────────────────────────────────────────────┐
│  🦊 Fediverse - Lemmy                             [Subscribe]│
│                                                               │
│  Reddit-like communities from the Fediverse                  │
│  7 feeds • Popular                                            │
└─────────────────────────────────────────────────────────────┘

✓ Lemmy - Linux Community
  Linux discussions and news
  openrss.org/lemmy.ml/c/linux

✓ Lemmy - Programming
  Programming community
  openrss.org/programming.dev/c/programming

✓ Lemmy - Privacy
  Privacy and security discussions
  openrss.org/lemmy.ml/c/privacy

✓ Lemmy - Technology (Beehaw)
  Tech news and discussions
  openrss.org/beehaw.org/c/technology

✓ Lemmy - Self-Hosted
  Self-hosting community
  openrss.org/lemmy.world/c/selfhosted

✓ Lemmy - Rust Programming
  Rust language community
  openrss.org/programming.dev/c/rust

✓ Lemmy - Open Source
  Open source projects and news
  openrss.org/lemmy.ml/c/opensource

┌─────────────────────────────────────────────────────────────┐
│  💡 Tip: Add any Lemmy community using OpenRSS.org          │
│                                                               │
│     Format: openrss.org/{instance}/c/{community}             │
│     Example: openrss.org/lemmy.ml/c/linux                    │
└─────────────────────────────────────────────────────────────┘

[Cancel]                                    [Subscribe to All]
```

---

## Onboarding Flow

### Step 1: Welcome Screen

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                    Welcome to FlowRSS! 👋                    │
│                                                               │
│         Your privacy-first, offline-first RSS reader         │
│                                                               │
│  ✓ No tracking, no ads, no algorithms                        │
│  ✓ All data stored locally on your device                    │
│  ✓ Works offline after initial sync                          │
│  ✓ Support for RSS, Atom, and Fediverse feeds               │
│                                                               │
│                    [Get Started]                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Step 2: Choose Your Interests

```
┌─────────────────────────────────────────────────────────────┐
│                  What are you interested in?                 │
│                                                               │
│  Select categories to see recommended feeds                  │
└─────────────────────────────────────────────────────────────┘

☑ Technology        ☑ Programming       ☐ AI & Machine Learning
☑ Fediverse         ☐ Business          ☐ Design & UX
☐ Crypto & Web3     ☐ News & World      ☐ Science & Research
☐ Culture           ☐ Productivity      ☐ Fun & Comics

                    [Continue]
```

### Step 3: Recommended Packs (Based on Selection)

**If user selected "Technology" and "Fediverse":**

```
┌─────────────────────────────────────────────────────────────┐
│              Recommended for you (3 packs)                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 💻 Tech News                                  [Subscribe] │
│ Stay updated with the latest technology news             │
│ 5 feeds: Hacker News, TechCrunch, The Verge, ...        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 🐘 Fediverse - Mastodon                       [Subscribe] │
│ Decentralized social media from Mastodon                 │
│ 7 feeds: @Gargron, @mozilla, #opensource, ...           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 🦊 Fediverse - Lemmy                          [Subscribe] │
│ Reddit-like communities from the Fediverse               │
│ 7 feeds: Linux, Programming, Privacy, ...               │
└──────────────────────────────────────────────────────────┘

[Skip]                                    [Subscribe to All]
```

### Step 4: All Done!

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                    You're all set! 🎉                        │
│                                                               │
│  Subscribed to 19 feeds across 3 packs                       │
│                                                               │
│  Your feeds are now syncing...                               │
│  [████████████████░░░░] 80%                                  │
│                                                               │
│  💡 Tip: Create folders to organize your feeds!              │
│     Right-click the sidebar to create a new folder.          │
│                                                               │
│                    [Start Reading]                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Post-Onboarding: First-Time User Experience

### Sidebar After Onboarding

```
┌─────────────────────────┐
│ 📥 All Articles (156)   │ ← New articles loaded
│ ⭐ Starred              │
│ 💾 Saved                │
├─────────────────────────┤
│ 📁 My Folders           │
│   💡 Create your first  │
│      folder to organize │
│      your feeds!        │
│   [+ New Folder]        │
├─────────────────────────┤
│ 📰 Your Feeds (19)      │
│   📰 Hacker News (12)   │
│   📰 TechCrunch (8)     │
│   📰 The Verge (15)     │
│   🐘 Mastodon Official  │
│   🐘 Mozilla            │
│   🐘 #OpenSource (23)   │
│   🦊 Lemmy - Linux (18) │
│   🦊 Lemmy - Programming│
│   ... (11 more)         │
├─────────────────────────┤
│ 📚 Discover More        │
│   • Browse Curated Packs│
│   • Add Custom Feed     │
│   • Import OPML         │
└─────────────────────────┘
```

### Tooltip on First Visit

```
┌─────────────────────────────────────────────┐
│  💡 Organize your feeds with folders!       │
│                                              │
│  Right-click here to create a folder,       │
│  then drag feeds into it.                   │
│                                              │
│  [Got it]                                    │
└─────────────────────────────────────────────┘
         ↓
    [+ New Folder]
```

---

## Settings: Fediverse Section

### New Settings Tab

```
┌─────────────────────────────────────────────────────────────┐
│  Settings                                                     │
│                                                               │
│  [General] [Appearance] [Feeds] [Fediverse] [Advanced]       │
│                                    ↑ NEW!                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Fediverse Settings                                           │
│                                                               │
│  Mastodon                                                     │
│  ─────────────────────────────────────────────────────────   │
│  Default instance: [mastodon.social        ▼]                │
│                                                               │
│  Quick add Mastodon account:                                 │
│  @[username]@[instance]                    [Add Feed]         │
│                                                               │
│  Lemmy                                                        │
│  ─────────────────────────────────────────────────────────   │
│  Default instance: [lemmy.world            ▼]                │
│                                                               │
│  Quick add Lemmy community:                                  │
│  [instance]/c/[community]                  [Add Feed]         │
│                                                               │
│  Popular Instances                                            │
│  ─────────────────────────────────────────────────────────   │
│  Mastodon:                                                    │
│  • mastodon.social (flagship)                                 │
│  • fosstodon.org (FOSS community)                             │
│  • techhub.social (tech professionals)                        │
│  • hachyderm.io (hackers & enthusiasts)                       │
│                                                               │
│  Lemmy:                                                       │
│  • lemmy.world (general purpose)                              │
│  • lemmy.ml (original instance)                               │
│  • beehaw.org (well-moderated)                                │
│  • programming.dev (programming-focused)                      │
│                                                               │
│  [Learn More About Fediverse]                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Help & Documentation

### In-App Help Section

```
┌─────────────────────────────────────────────────────────────┐
│  Help & Documentation                                         │
│                                                               │
│  Getting Started                                              │
│  • Welcome to FlowRSS                                         │
│  • Adding your first feeds                                    │
│  • Organizing with folders                                    │
│                                                               │
│  Fediverse Integration                                        │ ← NEW!
│  • What is the Fediverse?                                     │
│  • Adding Mastodon accounts                                   │
│  • Following Lemmy communities                                │
│  • Popular Fediverse instances                                │
│                                                               │
│  Advanced Features                                            │
│  • Keyboard shortcuts                                         │
│  • OPML import/export                                         │
│  • Custom feed URLs                                           │
└─────────────────────────────────────────────────────────────┘
```

### "What is the Fediverse?" Help Page

```
┌─────────────────────────────────────────────────────────────┐
│  What is the Fediverse?                                       │
│                                                               │
│  The Fediverse is a collection of decentralized social       │
│  networks that can communicate with each other. Unlike       │
│  traditional social media, no single company controls it.    │
│                                                               │
│  Popular Fediverse Platforms:                                 │
│                                                               │
│  🐘 Mastodon - Twitter-like microblogging                    │
│  🦊 Lemmy - Reddit-like communities                          │
│  📹 PeerTube - YouTube alternative                           │
│  📷 Pixelfed - Instagram alternative                         │
│                                                               │
│  How to Use in FlowRSS:                                       │
│                                                               │
│  1. Subscribe to curated Fediverse packs                     │
│  2. Add custom Mastodon accounts (.rss)                      │
│  3. Follow Lemmy communities (via OpenRSS)                   │
│  4. Organize in folders for easy access                      │
│                                                               │
│  [Browse Fediverse Packs]                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Marketing Copy for Onboarding

### Welcome Screen Tagline Options

1. "Your privacy-first RSS reader with Fediverse support"
2. "Read RSS feeds and follow the Fediverse, all in one place"
3. "The only RSS reader that speaks Fediverse"
4. "RSS meets the decentralized web"

### Feature Highlights

```
┌─────────────────────────────────────────────────────────────┐
│  Why FlowRSS?                                                 │
│                                                               │
│  ✓ Privacy-First                                              │
│    All data stored locally. No tracking, no ads.             │
│                                                               │
│  ✓ Fediverse Support                                          │
│    Follow Mastodon accounts and Lemmy communities.           │
│                                                               │
│  ✓ Powerful Organization                                      │
│    Create folders, tags, and categories.                     │
│                                                               │
│  ✓ Offline-First                                              │
│    Read your feeds anywhere, anytime.                        │
│                                                               │
│  ✓ Open Source                                                │
│    Transparent, community-driven development.                │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

**Onboarding Improvements:**

1. ✅ Fediverse packs prominently displayed
2. ✅ Clear explanations of what Fediverse is
3. ✅ Easy subscription process
4. ✅ Tips for adding custom feeds
5. ✅ Folder organization prompts
6. ✅ Help documentation

**User Journey:**

1. Welcome → Choose interests → Subscribe to packs → Start reading
2. Discover Fediverse → Subscribe to Mastodon/Lemmy → Organize in folders
3. Learn → Explore → Customize → Enjoy!

**This creates a smooth, educational onboarding experience that highlights FlowRSS's unique Fediverse support!**
