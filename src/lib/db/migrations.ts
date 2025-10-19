import { db, dbOperations } from './schema';

// List of broken feed URLs to remove
const BROKEN_FEEDS = [
  'https://blog.anthropic.com/rss',
  'https://netflixtechblog.com/feed',
  'https://openai.com/blog/rss/',
  'https://ai.googleblog.com/feeds/posts/default',
  'https://microconf.com/feed/',
  'https://www.starterstory.com/rss',
];

// New working feeds to add (if not already present)
const NEW_FEEDS = [
  {
    url: 'https://stackoverflow.blog/feed/',
    title: 'Stack Overflow Blog',
    description: 'Developer insights and news',
    category: 'Development',
  },
  {
    url: 'https://huggingface.co/blog/feed.xml',
    title: 'Hugging Face Blog',
    description: 'ML and AI developments',
    category: 'AI',
  },
  {
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    title: 'AWS ML Blog',
    description: 'Machine learning on AWS',
    category: 'AI',
  },
  {
    url: 'https://machinelearningmastery.com/feed/',
    title: 'ML Mastery',
    description: 'Practical ML tutorials',
    category: 'AI',
  },
  {
    url: 'https://www.saastr.com/feed/',
    title: 'SaaStr',
    description: 'SaaS insights and growth',
    category: 'Business',
  },
  {
    url: 'https://www.groovehq.com/blog/feed',
    title: 'Groove Blog',
    description: 'Building a SaaS startup',
    category: 'Business',
  },
];

export async function runMigrations() {
  try {
    console.log('[Migration] Starting feed cleanup and updates...');
    
    // Get current migration version
    const settings = await dbOperations.getSettings();
    const currentVersion = settings?.migrationVersion || 0;
    
    // Migration v1: Remove broken feeds and add new ones
    if (currentVersion < 1) {
      console.log('[Migration] Running v1: Feed cleanup');
      
      // Remove broken feeds
      const allFeeds = await dbOperations.getAllFeeds();
      let removedCount = 0;
      
      for (const feed of allFeeds) {
        if (BROKEN_FEEDS.includes(feed.url)) {
          await dbOperations.deleteFeed(feed.id);
          removedCount++;
          console.log(`[Migration] Removed broken feed: ${feed.title}`);
        }
      }
      
      // Add new working feeds (if not already present)
      const existingUrls = new Set(allFeeds.map(f => f.url));
      let addedCount = 0;
      
      for (const newFeed of NEW_FEEDS) {
        if (!existingUrls.has(newFeed.url)) {
          await dbOperations.addFeed({
            ...newFeed,
            isActive: true,
            errorCount: 0,
          });
          addedCount++;
          console.log(`[Migration] Added new feed: ${newFeed.title}`);
        }
      }
      
      // Update migration version
      await dbOperations.updateSettings({ migrationVersion: 1 });
      
      console.log(`[Migration] v1 complete: Removed ${removedCount} broken feeds, added ${addedCount} new feeds`);
      
      // Notify the UI to refresh feeds
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('refreshFeeds'));
        
        // Auto-fetch feeds if new ones were added
        if (addedCount > 0) {
          console.log('[Migration] Triggering auto-fetch for new feeds...');
          // Delay slightly to let UI update
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('autoFetchFeeds'));
          }, 500);
        }
      }
    }
    
    // Migration v2: Update to new curated feeds (optional - only if user wants)
    if (currentVersion < 2) {
      console.log('[Migration] v2: Curated feeds available');
      console.log('[Migration] To update feeds, clear your database or use "Add Feed" to add new packs');
      
      // Don't auto-update - let users choose
      await dbOperations.updateSettings({ migrationVersion: 2 });
    }
    
    return true;
  } catch (error) {
    console.error('[Migration] Error running migrations:', error);
    return false;
  }
}

// Check if migrations are needed
export async function needsMigration(): Promise<boolean> {
  try {
    const settings = await dbOperations.getSettings();
    const currentVersion = settings?.migrationVersion || 0;
    return currentVersion < 1;
  } catch (error) {
    console.error('[Migration] Error checking migration status:', error);
    return false;
  }
}
