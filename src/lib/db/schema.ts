import Dexie, { Table } from 'dexie';
import type { Feed, Article, FeedCategory, FeedFolder, UserSettings } from '@/types';

// IndexedDB Schema using Dexie
export class FlowRSSDatabase extends Dexie {
  feeds!: Table<Feed, string>;
  articles!: Table<Article, string>;
  categories!: Table<FeedCategory, string>;
  folders!: Table<FeedFolder, string>;
  settings!: Table<UserSettings, string>;

  constructor() {
    super('FlowRSSDB');
    
    // Version 1: Initial schema
    this.version(1).stores({
      feeds: 'id, url, category, isActive, lastFetched, createdAt',
      articles: 'id, feedId, link, pubDate, isRead, isStarred, isSaved, createdAt, [feedId+isRead]',
      categories: 'id, name, order',
      settings: 'id',
    });

    // Version 2: Add folders and enhanced feed organization
    this.version(2).stores({
      feeds: 'id, url, category, folderId, isActive, lastFetched, createdAt',
      articles: 'id, feedId, link, pubDate, isRead, isStarred, isSaved, createdAt, [feedId+isRead]',
      categories: 'id, name, order, parentId',
      folders: 'id, name, order, parentId',
      settings: 'id',
    });
  }
}

// Singleton instance
export const db = new FlowRSSDatabase();

// Helper functions
export const initializeDB = async (retries = 3): Promise<boolean> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[DB] Initialization attempt ${attempt}/${retries}`);
      await db.open();
      
      // Initialize default settings if not exists
      const settingsCount = await db.settings.count();
      if (settingsCount === 0) {
        await db.settings.add({
          id: 'default',
          theme: 'system',
          fontSize: 'medium',
          fontFamily: 'sans',
          lineHeight: 'normal',
          contentWidth: 'medium',
          showImages: true,
          autoMarkAsRead: false,
          openLinksInNewTab: true,
          enableNotifications: false,
          syncEnabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      
      console.log('[DB] Initialization successful');
      return true;
    } catch (error) {
      console.error(`[DB] Initialization attempt ${attempt} failed:`, error);
      
      if (attempt < retries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`[DB] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error('[DB] All initialization attempts failed');
  return false;
};

// Export database operations
export const dbOperations = {
  // Feeds
  async addFeed(feed: Omit<Feed, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = crypto.randomUUID();
    const now = new Date();
    return db.feeds.add({
      ...feed,
      id,
      createdAt: now,
      updatedAt: now,
    });
  },

  async updateFeed(id: string, updates: Partial<Feed>) {
    return db.feeds.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async deleteFeed(id: string) {
    await db.articles.where('feedId').equals(id).delete();
    return db.feeds.delete(id);
  },

  async getAllFeeds() {
    return db.feeds.toArray();
  },

  async getFeedById(id: string) {
    return db.feeds.get(id);
  },

  // Articles
  async addArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = crypto.randomUUID();
    const now = new Date();
    return db.articles.add({
      ...article,
      id,
      createdAt: now,
      updatedAt: now,
    });
  },

  async bulkAddArticles(articles: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>[]) {
    const now = new Date();
    const articlesWithIds = articles.map(article => ({
      ...article,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }));
    return db.articles.bulkAdd(articlesWithIds);
  },

  async updateArticle(id: string, updates: Partial<Article>) {
    return db.articles.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async getArticlesByFeed(feedId: string, limit?: number) {
    let query = db.articles.where('feedId').equals(feedId).reverse().sortBy('pubDate');
    if (limit) {
      const articles = await query;
      return articles.slice(0, limit);
    }
    return query;
  },

  async getUnreadArticles(limit?: number) {
    const articles = await db.articles
      .where('isRead')
      .equals(0)
      .reverse()
      .sortBy('pubDate');
    
    if (limit) {
      return articles.slice(0, limit);
    }
    return articles;
  },

  async getAllArticles(limit?: number) {
    let query = db.articles.orderBy('pubDate').reverse();
    if (limit) {
      return query.limit(limit).toArray();
    }
    return query.toArray();
  },

  async markAsRead(id: string) {
    return db.articles.update(id, {
      isRead: true,
      readAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async toggleStar(id: string) {
    const article = await db.articles.get(id);
    if (article) {
      return db.articles.update(id, {
        isStarred: !article.isStarred,
        updatedAt: new Date(),
      });
    }
  },

  async toggleSave(id: string) {
    const article = await db.articles.get(id);
    if (article) {
      return db.articles.update(id, {
        isSaved: !article.isSaved,
        updatedAt: new Date(),
      });
    }
  },

  async getStarredArticles(limit?: number) {
    // Filter in memory since IndexedDB doesn't index boolean fields well
    const allArticles = await db.articles.orderBy('pubDate').reverse().toArray();
    const starredArticles = allArticles.filter(article => article.isStarred === true);
    
    if (limit) {
      return starredArticles.slice(0, limit);
    }
    return starredArticles;
  },

  async getSavedArticles(limit?: number) {
    // Filter in memory since IndexedDB doesn't index boolean fields well
    const allArticles = await db.articles.orderBy('pubDate').reverse().toArray();
    const savedArticles = allArticles.filter(article => article.isSaved === true);
    
    if (limit) {
      return savedArticles.slice(0, limit);
    }
    return savedArticles;
  },

  // Folders
  async addFolder(folder: Omit<FeedFolder, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = crypto.randomUUID();
    const now = new Date();
    return db.folders.add({
      ...folder,
      id,
      createdAt: now,
      updatedAt: now,
    });
  },

  async updateFolder(id: string, updates: Partial<FeedFolder>) {
    return db.folders.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async deleteFolder(id: string) {
    // Remove folder reference from feeds
    const feeds = await db.feeds.where('folderId').equals(id).toArray();
    for (const feed of feeds) {
      await db.feeds.update(feed.id, { folderId: undefined });
    }
    return db.folders.delete(id);
  },

  async getAllFolders() {
    return db.folders.orderBy('order').toArray();
  },

  async getFolderById(id: string) {
    return db.folders.get(id);
  },

  async getFeedsByFolder(folderId: string) {
    return db.feeds.where('folderId').equals(folderId).toArray();
  },

  // Categories
  async addCategory(category: Omit<FeedCategory, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = crypto.randomUUID();
    const now = new Date();
    return db.categories.add({
      ...category,
      id,
      createdAt: now,
      updatedAt: now,
    });
  },

  async updateCategory(id: string, updates: Partial<FeedCategory>) {
    return db.categories.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async deleteCategory(id: string) {
    return db.categories.delete(id);
  },

  async getAllCategories() {
    return db.categories.orderBy('order').toArray();
  },

  // Settings
  async getSettings() {
    return db.settings.get('default');
  },

  async updateSettings(updates: Partial<UserSettings>) {
    return db.settings.update('default', {
      ...updates,
      updatedAt: new Date(),
    });
  },

  // Cleanup
  async deleteOldArticles(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    return db.articles
      .where('createdAt')
      .below(cutoffDate)
      .and(article => !article.isStarred && !article.isSaved)
      .delete();
  },
};
