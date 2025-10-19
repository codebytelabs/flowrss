import { supabase, isSupabaseConfigured } from './client';
import { dbOperations } from '@/lib/db/schema';
import type { Feed, Article } from '@/types';

export interface SyncResult {
  success: boolean;
  itemsSynced: number;
  error?: string;
}

export async function syncToCloud(): Promise<SyncResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      itemsSynced: 0,
      error: 'Supabase not configured',
    };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        itemsSynced: 0,
        error: 'User not authenticated',
      };
    }

    // Get local data
    const feeds = await dbOperations.getAllFeeds();
    const settings = await dbOperations.getSettings();

    let itemsSynced = 0;

    // Sync feeds
    for (const feed of feeds) {
      const { error } = await supabase
        .from('feeds')
        .upsert({
          id: feed.id,
          user_id: user.id,
          url: feed.url,
          title: feed.title,
          description: feed.description,
          category: feed.category,
          image_url: feed.imageUrl,
          is_active: feed.isActive,
          last_fetched: feed.lastFetched?.toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (!error) itemsSynced++;
    }

    // Sync settings
    if (settings) {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          theme: settings.theme,
          font_size: settings.fontSize,
          font_family: settings.fontFamily,
          preferences: {
            showImages: settings.showImages,
            autoMarkAsRead: settings.autoMarkAsRead,
            openLinksInNewTab: settings.openLinksInNewTab,
          },
          updated_at: new Date().toISOString(),
        });
    }

    // Update local sync status
    await dbOperations.updateSettings({
      lastSyncAt: new Date(),
    });

    return {
      success: true,
      itemsSynced,
    };
  } catch (error) {
    console.error('Sync error:', error);
    return {
      success: false,
      itemsSynced: 0,
      error: error instanceof Error ? error.message : 'Unknown sync error',
    };
  }
}

export async function syncFromCloud(): Promise<SyncResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      itemsSynced: 0,
      error: 'Supabase not configured',
    };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        itemsSynced: 0,
        error: 'User not authenticated',
      };
    }

    let itemsSynced = 0;

    // Fetch feeds from cloud
    const { data: cloudFeeds, error: feedsError } = await supabase
      .from('feeds')
      .select('*')
      .eq('user_id', user.id);

    if (!feedsError && cloudFeeds) {
      for (const cloudFeed of cloudFeeds) {
        const existingFeed = await dbOperations.getFeedById(cloudFeed.id);
        
        if (!existingFeed) {
          await dbOperations.addFeed({
            url: cloudFeed.url,
            title: cloudFeed.title,
            description: cloudFeed.description,
            category: cloudFeed.category,
            imageUrl: cloudFeed.image_url,
            isActive: cloudFeed.is_active,
            errorCount: 0,
          });
          itemsSynced++;
        }
      }
    }

    // Fetch settings from cloud
    const { data: cloudSettings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (cloudSettings) {
      await dbOperations.updateSettings({
        theme: cloudSettings.theme,
        fontSize: cloudSettings.font_size,
        fontFamily: cloudSettings.font_family,
        showImages: cloudSettings.preferences?.showImages,
        autoMarkAsRead: cloudSettings.preferences?.autoMarkAsRead,
        openLinksInNewTab: cloudSettings.preferences?.openLinksInNewTab,
        lastSyncAt: new Date(),
      });
    }

    return {
      success: true,
      itemsSynced,
    };
  } catch (error) {
    console.error('Sync error:', error);
    return {
      success: false,
      itemsSynced: 0,
      error: error instanceof Error ? error.message : 'Unknown sync error',
    };
  }
}
