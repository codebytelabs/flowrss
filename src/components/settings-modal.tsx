'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { dbOperations } from '@/lib/db/schema';
import { generateOPML, parseOPML, downloadOPML, readOPMLFile } from '@/lib/opml';
import { useToast } from '@/components/ui/toast';
import { useTheme } from 'next-themes';
import { AccountDialog } from '@/components/account-dialog';
import type { UserSettings } from '@/types';
import { Upload, Download, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [accountMode, setAccountMode] = useState<'signin' | 'signup'>('signup');

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    const userSettings = await dbOperations.getSettings();
    if (userSettings) {
      setSettings(userSettings);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    await dbOperations.updateSettings(settings);
    addToast('Settings saved successfully', 'success');
    onOpenChange(false);
  };

  const handleExportOPML = async () => {
    try {
      const feeds = await dbOperations.getAllFeeds();
      const opml = generateOPML(feeds);
      downloadOPML(opml);
      addToast('OPML exported successfully', 'success');
    } catch (error) {
      addToast('Failed to export OPML', 'error');
    }
  };

  const handleImportOPML = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await readOPMLFile(file);
      const feeds = parseOPML(content);

      for (const feed of feeds) {
        await dbOperations.addFeed({
          url: feed.xmlUrl,
          title: feed.title || feed.text,
          description: feed.title,
          category: feed.category,
          isActive: true,
          errorCount: 0,
        });
      }

      addToast(`Imported ${feeds.length} feeds successfully`, 'success');
      onOpenChange(false);
    } catch (error) {
      addToast('Failed to import OPML', 'error');
    }
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure? This will delete all feeds and articles.')) return;

    try {
      const feeds = await dbOperations.getAllFeeds();
      for (const feed of feeds) {
        await dbOperations.deleteFeed(feed.id);
      }
      addToast('All data cleared', 'success');
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      addToast('Failed to clear data', 'error');
    }
  };

  if (!settings) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="font-semibold">Appearance</h3>
            
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="sepia">Sepia</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select
                value={settings.fontSize}
                onChange={(e) =>
                  setSettings({ ...settings, fontSize: e.target.value as any })
                }
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={settings.fontFamily}
                onChange={(e) =>
                  setSettings({ ...settings, fontFamily: e.target.value as any })
                }
              >
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Line Height</Label>
              <Select
                value={settings.lineHeight}
                onChange={(e) =>
                  setSettings({ ...settings, lineHeight: e.target.value as any })
                }
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="relaxed">Relaxed</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Content Width</Label>
              <Select
                value={settings.contentWidth}
                onChange={(e) =>
                  setSettings({ ...settings, contentWidth: e.target.value as any })
                }
              >
                <option value="narrow">Narrow</option>
                <option value="medium">Medium</option>
                <option value="wide">Wide</option>
                <option value="full">Full</option>
              </Select>
            </div>
          </div>

          {/* Reading Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold">Reading Preferences</h3>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showImages}
                onChange={(e) =>
                  setSettings({ ...settings, showImages: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">Show images in articles</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.autoMarkAsRead}
                onChange={(e) =>
                  setSettings({ ...settings, autoMarkAsRead: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">Auto-mark articles as read</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.openLinksInNewTab}
                onChange={(e) =>
                  setSettings({ ...settings, openLinksInNewTab: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">Open links in new tab</span>
            </label>
          </div>

          {/* Account Management */}
          <div className="space-y-4">
            <h3 className="font-semibold">Account Management</h3>
            
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium">Cloud Sync (Optional)</p>
              <p className="text-xs text-muted-foreground">
                Sign up to sync your feeds across devices. FlowRSS works 100% offline without an account.
              </p>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setAccountMode('signup');
                    setAccountDialogOpen(true);
                  }}
                >
                  Sign Up
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setAccountMode('signin');
                    setAccountDialogOpen(true);
                  }}
                >
                  Sign In
                </Button>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                ✅ No account needed for local use
              </p>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="font-semibold">Data Management</h3>
            
            <div className="flex gap-2">
              <Button onClick={handleExportOPML} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export OPML
              </Button>
              
              <label className="flex-1 cursor-pointer">
                <Button variant="outline" className="w-full pointer-events-none">
                  <Upload className="w-4 h-4 mr-2" />
                  Import OPML
                </Button>
                <input
                  type="file"
                  accept=".opml,.xml"
                  onChange={handleImportOPML}
                  className="hidden"
                />
              </label>
            </div>

            <Button
              onClick={handleClearData}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    
    <AccountDialog
      open={accountDialogOpen}
      onOpenChange={setAccountDialogOpen}
      mode={accountMode}
    />
    </>
  );
}
