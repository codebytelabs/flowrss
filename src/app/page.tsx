"use client";

import { useEffect, useState } from "react";
import { initializeDB } from "@/lib/db/schema";
import { MainLayout } from "@/components/layout/main-layout";
import { WelcomeScreen } from "@/components/welcome-screen";
import { dbOperations } from "@/lib/db/schema";
import { registerServiceWorker } from "@/lib/register-sw";
import { runMigrations } from "@/lib/db/migrations";

// Import reset utilities for debugging
if (typeof window !== 'undefined') {
  import("@/lib/db/reset");
}

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasFeeds, setHasFeeds] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [migrationStatus, setMigrationStatus] = useState<string>("");

  useEffect(() => {
    async function init() {
      try {
        setMigrationStatus("Initializing database...");
        const success = await initializeDB();
        setIsInitialized(success);

        if (success) {
          setMigrationStatus("Running migrations...");
          // Run database migrations to clean up broken feeds
          const migrationResult = await runMigrations();
          
          if (migrationResult) {
            setMigrationStatus("Loading feeds...");
          }

          const feeds = await dbOperations.getAllFeeds();
          setHasFeeds(feeds.length > 0);
        }
      } catch (error) {
        console.error("[App] Initialization error:", error);
      } finally {
        setIsLoading(false);
        setMigrationStatus("");
      }

      // Register service worker
      registerServiceWorker();
    }

    init();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {migrationStatus || "Initializing FlowRSS..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive">Failed to initialize database</p>
        </div>
      </div>
    );
  }

  if (!hasFeeds) {
    return <WelcomeScreen onComplete={() => setHasFeeds(true)} />;
  }

  return <MainLayout />;
}
