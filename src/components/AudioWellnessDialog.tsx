// UX/UI Enhancements - Audio Wellness Integration Component v0.2
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AudioResource, AudioWellnessSystem } from '../utils/motivationalContent';
import { Music, Play, Pause, ExternalLink, Search, Volume2, Brain, Waves, Clock, Star } from 'lucide-react';

interface AudioWellnessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryIcons = {
  nature_sounds: <Waves className="w-4 h-4" />,
  focus_music: <Music className="w-4 h-4" />,
  meditation: <Brain className="w-4 h-4" />,
  brown_noise: <Volume2 className="w-4 h-4" />,
  binaural_beats: <Waves className="w-4 h-4" />
};

const categoryColors = {
  nature_sounds: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  focus_music: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  meditation: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  brown_noise: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  binaural_beats: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
};

const providerBadges = {
  mynoise: 'MyNoise',
  youtube: 'YouTube',
  spotify: 'Spotify',
  freesound: 'Freesound',
  custom: 'Custom'
};

export const AudioWellnessDialog: React.FC<AudioWellnessDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'focus' | 'relaxation' | 'categories'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AudioResource['category'] | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Get filtered resources based on active tab and search
  const getFilteredResources = (): AudioResource[] => {
    let resources: AudioResource[] = [];

    switch (activeTab) {
      case 'all':
        resources = AudioWellnessSystem.getAllResources();
        break;
      case 'focus':
        resources = AudioWellnessSystem.getResourcesForFocus();
        break;
      case 'relaxation':
        resources = AudioWellnessSystem.getResourcesForRelaxation();
        break;
      case 'categories':
        if (selectedCategory) {
          resources = AudioWellnessSystem.getResourcesByCategory(selectedCategory);
        } else {
          resources = AudioWellnessSystem.getAllResources();
        }
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      resources = AudioWellnessSystem.searchResources(searchQuery);
    }

    return resources;
  };

  const handleOpenResource = (resource: AudioResource) => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
    setCurrentlyPlaying(resource.id);
  };

  const formatDuration = (minutes: number): string => {
    if (minutes === 0) return 'Continuous';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const resources = getFilteredResources();
  const categories = Array.from(new Set(AudioWellnessSystem.getAllResources().map(r => r.category)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="w-6 h-6 text-blue-500" />
            🎵 Audio Wellness & Focus Center
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ADHD-optimized sounds and music for better focus, relaxation, and productivity
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for sounds, music, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
            <Button
              variant={activeTab === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('all')}
              className="rounded-b-none"
            >
              All Resources
            </Button>
            <Button
              variant={activeTab === 'focus' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('focus')}
              className="rounded-b-none"
            >
              <Brain className="w-4 h-4 mr-1" />
              For Focus
            </Button>
            <Button
              variant={activeTab === 'relaxation' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('relaxation')}
              className="rounded-b-none"
            >
              <Waves className="w-4 h-4 mr-1" />
              For Relaxation
            </Button>
            <Button
              variant={activeTab === 'categories' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('categories')}
              className="rounded-b-none"
            >
              Categories
            </Button>
          </div>

          {/* Category Selection (when categories tab is active) */}
          {activeTab === 'categories' && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="flex items-center gap-1"
                  >
                    {categoryIcons[category]}
                    {category.replace('_', ' ').toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Audio Resources Grid */}
          <div className="flex-1 overflow-y-auto">
            {resources.length === 0 ? (
              <div className="text-center py-8">
                <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No results found for your search.' : 'No resources available in this category.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map(resource => (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {categoryIcons[resource.category]}
                            {resource.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {resource.description}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleOpenResource(resource)}
                          className="ml-2 flex items-center gap-1"
                        >
                          {currentlyPlaying === resource.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          {currentlyPlaying === resource.id ? 'Playing' : 'Play'}
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={categoryColors[resource.category]}>
                          {resource.category.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {providerBadges[resource.provider]}
                        </Badge>
                        {resource.duration !== undefined && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(resource.duration)}
                          </Badge>
                        )}
                      </div>

                      {/* ADHD Benefits */}
                      <div className="mb-3">
                        <h5 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                          🧠 ADHD Benefits:
                        </h5>
                        <ul className="text-xs space-y-1">
                          {resource.adhdBenefits.slice(0, 2).map((benefit, index) => (
                            <li key={index} className="text-green-700 dark:text-green-400 flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {benefit}
                            </li>
                          ))}
                          {resource.adhdBenefits.length > 2 && (
                            <li className="text-xs text-gray-500">
                              +{resource.adhdBenefits.length - 2} more benefits
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Tags */}
                      {resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.slice(0, 4).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Access Section */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              Quick ADHD Focus Boosters
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenResource(AudioWellnessSystem.getResourcesByCategory('brown_noise')[0])}
                className="flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Brown Noise
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenResource(AudioWellnessSystem.getResourcesByCategory('nature_sounds')[0])}
                className="flex items-center gap-2"
              >
                <Waves className="w-4 h-4" />
                Rain Sounds
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenResource(AudioWellnessSystem.getResourcesByCategory('focus_music')[0])}
                className="flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                Lo-Fi Music
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenResource(AudioWellnessSystem.getResourcesByCategory('binaural_beats')[0])}
                className="flex items-center gap-2"
              >
                <Waves className="w-4 h-4" />
                Alpha Waves
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioWellnessDialog;
