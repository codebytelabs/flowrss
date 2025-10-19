/**
 * Database Reset Utilities
 * Use these functions to reset the database for testing or fresh start
 */

export async function resetDatabase(): Promise<boolean> {
  try {
    console.log('[Reset] Deleting FlowRSSDB database...');
    
    // Close any open connections
    if (typeof window !== 'undefined') {
      const { db } = await import('./schema');
      db.close();
    }
    
    // Delete the database
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('FlowRSSDB');
      
      request.onsuccess = () => {
        console.log('[Reset] Database deleted successfully');
        resolve();
      };
      
      request.onerror = () => {
        console.error('[Reset] Error deleting database');
        reject(request.error);
      };
      
      request.onblocked = () => {
        console.warn('[Reset] Database deletion blocked - close all tabs');
      };
    });
    
    return true;
  } catch (error) {
    console.error('[Reset] Failed to reset database:', error);
    return false;
  }
}

export async function clearAllFeeds(): Promise<boolean> {
  try {
    console.log('[Reset] Clearing all feeds...');
    const { db } = await import('./schema');
    
    // Delete all articles
    await db.articles.clear();
    console.log('[Reset] Cleared all articles');
    
    // Delete all feeds
    await db.feeds.clear();
    console.log('[Reset] Cleared all feeds');
    
    // Reset migration version to trigger welcome screen
    await db.settings.update('default', {
      migrationVersion: 0,
      updatedAt: new Date(),
    });
    console.log('[Reset] Reset migration version');
    
    return true;
  } catch (error) {
    console.error('[Reset] Failed to clear feeds:', error);
    return false;
  }
}

// Make functions available in console for debugging
if (typeof window !== 'undefined') {
  (window as any).resetDatabase = resetDatabase;
  (window as any).clearAllFeeds = clearAllFeeds;
  console.log('[Reset] Database reset functions available:');
  console.log('  - resetDatabase() - Delete entire database');
  console.log('  - clearAllFeeds() - Clear feeds but keep settings');
}
