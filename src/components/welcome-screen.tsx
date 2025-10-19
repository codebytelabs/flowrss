'use client';

import { useState } from 'react';
import { curatedPacks, getPopularPacks } from '@/lib/curated-packs';
import { dbOperations } from '@/lib/db/schema';
import { parseFeedUrl } from '@/lib/rss/parser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Rss, Sparkles, Shield, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState<'intro' | 'packs' | 'custom'>('intro');
  const [selectedPacks, setSelectedPacks] = useState<string[]>([]);
  const [customUrl, setCustomUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const popularPacks = getPopularPacks();
  const allPacks = curatedPacks;

  const handlePackToggle = (packId: string) => {
    setSelectedPacks(prev =>
      prev.includes(packId)
        ? prev.filter(id => id !== packId)
        : [...prev, packId]
    );
  };

  const handleAddFeeds = async () => {
    setIsLoading(true);

    try {
      // Add feeds from selected packs
      for (const packId of selectedPacks) {
        const pack = curatedPacks.find(p => p.id === packId);
        if (pack) {
          for (const feed of pack.feeds) {
            await dbOperations.addFeed({
              url: feed.url,
              title: feed.title,
              description: feed.description,
              category: pack.category,
              isActive: true,
              errorCount: 0,
            });
          }
        }
      }

      // Add custom feed if provided
      if (customUrl) {
        const result = await parseFeedUrl(customUrl);
        if (result.success && result.metadata) {
          await dbOperations.addFeed({
            url: customUrl,
            title: result.metadata.title || 'Custom Feed',
            description: result.metadata.description,
            imageUrl: result.metadata.imageUrl,
            isActive: true,
            errorCount: 0,
          });
        }
      }

      onComplete();
    } catch (error) {
      console.error('Error adding feeds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl w-full space-y-16">
          {/* Hero Section - Folo inspired */}
          <div className="text-center space-y-6 pt-16">
            {/* Logo with gradient */}
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl flex items-center justify-center">
              <Rss className="w-12 h-12 text-white" />
            </div>

            {/* Hero Text */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Welcome to FlowRSS
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your modern, privacy-first RSS reader with Fediverse support.
                Organize, read, and discover content from across the web.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => setStep('packs')}
                className="px-8 py-6 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-lg"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Features Grid - Folo style cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group p-8 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-md border border-white/20 dark:border-black/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Privacy First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your data stays on your device. No tracking, no ads, no accounts required.
              </p>
            </Card>

            <Card className="group p-8 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-md border border-white/20 dark:border-black/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Offline First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Read anywhere, anytime. All your articles are stored locally for offline access.
              </p>
            </Card>

            <Card className="group p-8 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-md border border-white/20 dark:border-black/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Smart Organization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create folders, use auto-categories, and organize feeds exactly how you want them.
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Choose Your Feeds</h2>
          <p className="text-muted-foreground">
            Select curated packs or add your own feeds
          </p>
        </div>

        {/* Popular Packs */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Popular Packs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularPacks.map(pack => (
              <Card
                key={pack.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedPacks.includes(pack.id)
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-accent'
                }`}
                onClick={() => handlePackToggle(pack.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{pack.icon}</div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold text-sm">{pack.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {pack.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pack.feeds.length} feeds
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All Packs */}
        <div>
          <h3 className="text-lg font-semibold mb-3">All Packs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPacks.filter(pack => !pack.isPopular).map(pack => (
              <Card
                key={pack.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedPacks.includes(pack.id)
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-accent'
                }`}
                onClick={() => handlePackToggle(pack.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{pack.icon}</div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold text-sm">{pack.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {pack.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pack.feeds.length} feeds
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Or add a custom feed</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter RSS feed URL..."
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep('intro')}>
            Back
          </Button>
          <Button
            onClick={handleAddFeeds}
            disabled={isLoading || (selectedPacks.length === 0 && !customUrl)}
          >
            {isLoading ? 'Adding Feeds...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
