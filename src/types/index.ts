// Core types for FlowRSS

export interface Feed {
  id: string;
  url: string;
  title: string;
  description?: string;
  link?: string;
  imageUrl?: string;
  category?: string; // Primary category (for backwards compatibility)
  categories?: string[]; // Multiple categories support
  folderId?: string; // User-created folder
  tags?: string[]; // User-defined tags
  lastFetched?: Date;
  lastUpdated?: Date;
  fetchInterval?: number; // minutes
  isActive: boolean;
  errorCount: number;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  feedId: string;
  title: string;
  link: string;
  description?: string;
  content?: string;
  fullContent?: string; // Extracted full text
  author?: string;
  pubDate?: Date;
  imageUrl?: string;
  isRead: boolean;
  isStarred: boolean;
  isSaved: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedCategory {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  order: number;
  parentId?: string; // For nested categories/folders
  isCollapsed?: boolean; // For UI state
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedFolder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  order: number;
  parentId?: string; // For nested folders
  isCollapsed?: boolean;
  feedIds: string[]; // Feeds in this folder
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  theme: 'light' | 'dark' | 'sepia' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  fontFamily: 'sans' | 'serif' | 'mono';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  contentWidth: 'narrow' | 'medium' | 'wide' | 'full';
  showImages: boolean;
  autoMarkAsRead: boolean;
  openLinksInNewTab: boolean;
  enableNotifications: boolean;
  syncEnabled: boolean;
  migrationVersion?: number;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CuratedPack {
  id: string;
  name: string;
  description: string;
  category: string;
  feeds: Array<{
    url: string;
    title: string;
    description?: string;
  }>;
  icon?: string;
  isPopular: boolean;
  downloadCount: number;
}

export interface FeedHealth {
  feedId: string;
  status: 'healthy' | 'warning' | 'error' | 'stale';
  lastCheck: Date;
  responseTime?: number;
  errorMessage?: string;
  consecutiveErrors: number;
  lastSuccessfulFetch?: Date;
}

export interface SyncStatus {
  lastSync: Date;
  status: 'idle' | 'syncing' | 'error';
  itemsSynced: number;
  error?: string;
}

// API Response types
export interface ParsedFeed {
  title?: string;
  description?: string;
  link?: string;
  image?: {
    url?: string;
    title?: string;
  };
  items: ParsedArticle[];
}

export interface ParsedArticle {
  title?: string;
  link?: string;
  pubDate?: string;
  creator?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  categories?: string[];
  isoDate?: string;
}

// UI State types
export interface ReaderState {
  selectedArticle: Article | null;
  selectedFeed: Feed | null;
  viewMode: 'list' | 'magazine' | 'compact';
  filterMode: 'all' | 'unread' | 'starred' | 'saved';
  sortBy: 'date' | 'title' | 'feed';
  sortOrder: 'asc' | 'desc';
}
