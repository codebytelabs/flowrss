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
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary rounded-2xl">
                <Rss className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl font-bold">FlowRSS</h1>
            <p className="text-xl text-muted-foreground">Your content, in flow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
            <Card className="p-6 space-y-2">
              <Shield className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-semibold">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                No tracking, no signup required. Your data stays local.
              </p>
            </Card>
            <Card className="p-6 space-y-2">
              <Zap className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-semibold">Offline First</h3>
              <p className="text-sm text-muted-foreground">
                Read anywhere, anytime. Works without internet.
              </p>
            </Card>
            <Card className="p-6 space-y-2">
              <Sparkles className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-semibold">AI Enhanced</h3>
              <p className="text-sm text-muted-foreground">
                Optional AI summaries and smart recommendations.
              </p>
            </Card>
          </div>

          <Button size="lg" onClick={() => setStep('packs')} className="px-8">
            Get Started
          </Button>
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
