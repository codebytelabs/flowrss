'use client';

import { useState } from 'react';
import { curatedPacks, getPopularPacks } from '@/lib/curated-packs';
import { dbOperations } from '@/lib/db/schema';
import { parseFeedUrl } from '@/lib/rss/parser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sparkles, Shield, Zap } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-5xl w-full space-y-12">
          {/* Hero Section - Modern & Clean */}
          <div className="text-center space-y-8 pt-8">
            {/* FlowRSS Logo - Large & High Resolution */}
            <div className="flex justify-center mb-4">
              <img 
                src="/logo-full.png" 
                alt="FlowRSS" 
                className="h-32 md:h-40 w-auto object-contain"
                style={{ imageRendering: 'crisp-edges' as any }}
              />
            </div>

            {/* Hero Text */}
            <div className="space-y-5">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Your content, in flow
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                <span className="font-semibold text-foreground">100% private.</span> Your data never leaves your device.
                <br />
                No tracking. No ads. No accounts. Just pure reading.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Button
                size="lg"
                onClick={() => setStep('packs')}
                className="px-8 py-6 text-base font-medium rounded-lg hover:scale-105 transition-transform duration-200"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Features Grid - Clean Cards */}
          <div className="grid md:grid-cols-3 gap-6 px-4">
            <Card className="group p-7 rounded-xl border-2 border-primary/20 bg-card hover:shadow-lg hover:border-primary/40 transition-all duration-200">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-3">Privacy First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Zero tracking.</span> Your data stays on your device. No cloud sync, no data collection, no accounts required. Complete privacy guaranteed.
              </p>
            </Card>

            <Card className="group p-7 rounded-xl border-2 border-border bg-card hover:shadow-lg hover:border-primary/40 transition-all duration-200">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-3">Offline First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Read anywhere, anytime. All your articles are stored locally for offline access. No internet? No problem.
              </p>
            </Card>

            <Card className="group p-7 rounded-xl border-2 border-border bg-card hover:shadow-lg hover:border-primary/40 transition-all duration-200">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-3">Smart Organization</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create folders, use auto-categories, and organize feeds exactly how you want them. Your way, your rules.
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Group packs by category
  const categories = [
    { name: 'Technology & Development', ids: ['tech-news', 'developer', 'ai-ml'] },
    { name: 'Fediverse', ids: ['fediverse-mastodon', 'fediverse-lemmy', 'fediverse-mixed'] },
    { name: 'Business & Design', ids: ['business-startups', 'design-ux'] },
    { name: 'Knowledge & Culture', ids: ['science-research', 'culture-longform', 'productivity'] },
    { name: 'More', ids: ['crypto-web3', 'news-world', 'fun-comics'] },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header with Logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo-small.png" 
              alt="FlowRSS" 
              className="h-20 w-auto object-contain"
              style={{ imageRendering: 'crisp-edges' as any }}
            />
          </div>
          <h2 className="text-3xl font-bold">Choose Your Feeds</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select curated packs to get started. <span className="font-semibold text-foreground">All stored locally on your device.</span>
          </p>
        </div>

        {/* Categorized Packs */}
        {categories.map(category => {
          const categoryPacks = allPacks.filter(pack => category.ids.includes(pack.id));
          if (categoryPacks.length === 0) return null;

          return (
            <div key={category.name} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold">{category.name}</h3>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryPacks.map(pack => (
                  <Card
                    key={pack.id}
                    className={`p-5 cursor-pointer transition-all rounded-xl border ${
                      selectedPacks.includes(pack.id)
                        ? 'ring-2 ring-primary bg-primary/5 border-primary'
                        : 'border-border hover:border-primary/50 hover:shadow-md'
                    }`}
                    onClick={() => handlePackToggle(pack.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl flex-shrink-0">{pack.icon}</div>
                      <div className="flex-1 space-y-1.5">
                        <h4 className="font-semibold text-sm">{pack.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {pack.description}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">
                          {pack.feeds.length} feeds
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-semibold">Or add a custom feed</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter RSS feed URL..."
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              className="flex-1 rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-border">
          <Button 
            variant="outline" 
            onClick={() => setStep('intro')}
            className="rounded-lg"
          >
            Back
          </Button>
          <Button
            onClick={handleAddFeeds}
            disabled={isLoading || (selectedPacks.length === 0 && !customUrl)}
            className="rounded-lg px-8"
          >
            {isLoading ? 'Adding Feeds...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
