import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { Palette, Check, Sparkles, Zap, Heart, TreePine } from 'lucide-react';
import { availablePalettes, applyColorPalette, getSavedPalette, type ColorPalette } from '../styles/colorPalettes';
import { toast } from 'sonner';

interface ColorPaletteSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ColorPaletteSelector = ({ open, onOpenChange }: ColorPaletteSelectorProps) => {
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(getSavedPalette());
  const [previewPalette, setPreviewPalette] = useState<ColorPalette | null>(null);

  const handlePreview = (palette: ColorPalette) => {
    setPreviewPalette(palette);
    applyColorPalette(palette);
  };

  const handleApply = (palette: ColorPalette) => {
    setSelectedPalette(palette);
    applyColorPalette(palette);
    toast.success(`Applied ${palette.name} color scheme!`, {
      description: palette.description,
      duration: 3000,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Revert to previously selected palette
    applyColorPalette(selectedPalette);
    setPreviewPalette(null);
    onOpenChange(false);
  };

  const ColorSwatch = ({ color, size = 'sm' }: { color: string; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };
    
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full border-2 border-white dark:border-gray-600 shadow-sm`}
        style={{ backgroundColor: color }}
      />
    );
  };

  const getPaletteIcon = (paletteId: string) => {
    switch (paletteId) {
      case 'cyberpunk':
        return <Zap className="w-5 h-5" />;
      case 'warm-gradient':
        return <Heart className="w-5 h-5" />;
      case 'forest-theme':
        return <TreePine className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Palette className="w-6 h-6" />
            Color Palette Selector
          </DialogTitle>
          <DialogDescription>
            Choose a color scheme that matches your mood and helps you focus. Preview any palette before applying it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {availablePalettes.map((palette) => (
            <motion.div
              key={palette.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Card className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
                selectedPalette.id === palette.id 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}>
                {/* Selected indicator */}
                {selectedPalette.id === palette.id && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary-500 text-white flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Current
                    </Badge>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800">
                      {getPaletteIcon(palette.id)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                        {palette.name}
                      </h3>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        {palette.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Color swatches preview */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-surface-700 dark:text-surface-300 w-16">Primary:</span>
                    <div className="flex gap-1">
                      {[palette.primary[300], palette.primary[500], palette.primary[700]].map((color, index) => (
                        <ColorSwatch key={index} color={color} size="md" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-surface-700 dark:text-surface-300 w-16">Secondary:</span>
                    <div className="flex gap-1">
                      {[palette.secondary[300], palette.secondary[500], palette.secondary[700]].map((color, index) => (
                        <ColorSwatch key={index} color={color} size="md" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-surface-700 dark:text-surface-300 w-16">ADHD:</span>
                    <div className="flex gap-1">
                      <ColorSwatch color={palette.adhd.focus[500]} size="md" />
                      <ColorSwatch color={palette.adhd.calm[500]} size="md" />
                      <ColorSwatch color={palette.adhd.energy[500]} size="md" />
                      <ColorSwatch color={palette.adhd.creative[500]} size="md" />
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(palette)}
                    className="flex-1"
                  >
                    Preview
                  </Button>
                  <Button
                    onClick={() => handleApply(palette)}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                    disabled={selectedPalette.id === palette.id}
                  >
                    {selectedPalette.id === palette.id ? 'Applied' : 'Apply'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
          {previewPalette && (
            <Button 
              onClick={() => handleApply(previewPalette)} 
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
            >
              Apply Preview
            </Button>
          )}
        </div>

        {/* Custom palette notice */}
        <div className="mt-4 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-primary-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-surface-900 dark:text-surface-100 mb-1">
                Custom Palette Coming Soon!
              </h4>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                We're working on a custom palette builder where you'll be able to create your own color schemes with gradient controls and save multiple custom themes.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorPaletteSelector;
