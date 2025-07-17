import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion } from 'framer-motion';
import { Palette, Save, RotateCcw, Eye, Download, Upload } from 'lucide-react';
import { applyColorPalette, type ColorPalette } from '../styles/colorPalettes';
import { toast } from 'sonner';

interface CustomPaletteBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomPaletteBuilder = ({ open, onOpenChange }: CustomPaletteBuilderProps) => {
  const [paletteName, setPaletteName] = useState('My Custom Theme');
  const [currentColors, setCurrentColors] = useState({
    primary: '#0ea5e9',
    secondary: '#a855f7',
    accent: '#14b8a6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444'
  });

  const generateColorShades = (baseColor: string) => {
    // Simplified shade generation - in real implementation this would be more sophisticated
    const shades = {
      50: lightenColor(baseColor, 0.95),
      100: lightenColor(baseColor, 0.9),
      200: lightenColor(baseColor, 0.8),
      300: lightenColor(baseColor, 0.6),
      400: lightenColor(baseColor, 0.3),
      500: baseColor,
      600: darkenColor(baseColor, 0.1),
      700: darkenColor(baseColor, 0.2),
      800: darkenColor(baseColor, 0.3),
      900: darkenColor(baseColor, 0.4),
      950: darkenColor(baseColor, 0.5)
    };
    return shades;
  };

  const lightenColor = (color: string, amount: number): string => {
    // Simple lightening function - would need proper color space conversion in production
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const newR = Math.min(255, Math.floor(r + (255 - r) * amount));
    const newG = Math.min(255, Math.floor(g + (255 - g) * amount));
    const newB = Math.min(255, Math.floor(b + (255 - b) * amount));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const darkenColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const newR = Math.max(0, Math.floor(r * (1 - amount)));
    const newG = Math.max(0, Math.floor(g * (1 - amount)));
    const newB = Math.max(0, Math.floor(b * (1 - amount)));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const createCustomPalette = (): ColorPalette => {
    const primaryShades = generateColorShades(currentColors.primary);
    const secondaryShades = generateColorShades(currentColors.secondary);
    const accentShades = generateColorShades(currentColors.accent);
    const successShades = generateColorShades(currentColors.success);
    const warningShades = generateColorShades(currentColors.warning);
    const errorShades = generateColorShades(currentColors.error);
    
    return {
      name: paletteName,
      id: `custom-${Date.now()}`,
      description: 'User-created custom palette',
      primary: primaryShades,
      secondary: secondaryShades,
      accent: accentShades,
      success: successShades,
      warning: warningShades,
      error: errorShades,
      surface: {
        50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
        400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
        800: '#1e293b', 900: '#0f172a', 950: '#020617'
      },
      adhd: {
        focus: {
          50: primaryShades[50], 100: primaryShades[100], 200: primaryShades[200],
          300: primaryShades[300], 400: primaryShades[400], 500: primaryShades[500],
          600: primaryShades[600], 700: primaryShades[700], 800: primaryShades[800], 900: primaryShades[900]
        },
        calm: {
          50: successShades[50], 100: successShades[100], 200: successShades[200],
          300: successShades[300], 400: successShades[400], 500: successShades[500],
          600: successShades[600], 700: successShades[700], 800: successShades[800], 900: successShades[900]
        },
        energy: {
          50: warningShades[50], 100: warningShades[100], 200: warningShades[200],
          300: warningShades[300], 400: warningShades[400], 500: warningShades[500],
          600: warningShades[600], 700: warningShades[700], 800: warningShades[800], 900: warningShades[900]
        },
        creative: {
          50: secondaryShades[50], 100: secondaryShades[100], 200: secondaryShades[200],
          300: secondaryShades[300], 400: secondaryShades[400], 500: secondaryShades[500],
          600: secondaryShades[600], 700: secondaryShades[700], 800: secondaryShades[800], 900: secondaryShades[900]
        }
      }
    };
  };

  const handlePreview = () => {
    const customPalette = createCustomPalette();
    applyColorPalette(customPalette);
    toast.success('Preview applied!', {
      description: 'See how your custom colors look throughout the app'
    });
  };

  const handleSave = () => {
    const customPalette = createCustomPalette();
    
    // Save to localStorage
    const savedPalettes = JSON.parse(localStorage.getItem('customPalettes') || '[]');
    savedPalettes.push(customPalette);
    localStorage.setItem('customPalettes', JSON.stringify(savedPalettes));
    
    applyColorPalette(customPalette);
    
    toast.success(`Saved "${paletteName}"!`, {
      description: 'Your custom palette has been saved and applied'
    });
    
    onOpenChange(false);
  };

  const handleExport = () => {
    const customPalette = createCustomPalette();
    const dataStr = JSON.stringify(customPalette, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paletteName.replace(/\s+/g, '-').toLowerCase()}-palette.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast.success('Palette exported!', {
      description: 'Share your custom palette with others'
    });
  };

  const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2 items-center">
        <div 
          className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
          style={{ backgroundColor: value }}
        />
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-8 p-0 border-none cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Palette className="w-6 h-6" />
            Custom Palette Builder
          </DialogTitle>
          <DialogDescription>
            Create your own personalized color scheme. Adjust colors to match your preferences and save for future use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Palette Name */}
          <div className="space-y-2">
            <Label htmlFor="paletteName" className="text-sm font-medium">Palette Name</Label>
            <Input
              id="paletteName"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              placeholder="My Awesome Theme"
              className="w-full"
            />
          </div>

          {/* Color Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Core Colors</h3>
              <div className="space-y-4">
                <ColorInput
                  label="Primary"
                  value={currentColors.primary}
                  onChange={(value) => setCurrentColors(prev => ({ ...prev, primary: value }))}
                />
                <ColorInput
                  label="Secondary"
                  value={currentColors.secondary}
                  onChange={(value) => setCurrentColors(prev => ({ ...prev, secondary: value }))}
                />
                <ColorInput
                  label="Accent"
                  value={currentColors.accent}
                  onChange={(value) => setCurrentColors(prev => ({ ...prev, accent: value }))}
                />
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Status Colors</h3>
              <div className="space-y-4">
                <ColorInput
                  label="Success"
                  value={currentColors.success}
                  onChange={(value) => setCurrentColors(prev => ({ ...prev, success: value }))}
                />
                <ColorInput
                  label="Warning"
                  value={currentColors.warning}
                  onChange={(value) => setCurrentColors(prev => ({ ...prev, warning: value }))}
                />
                <ColorInput
                  label="Error"
                  value={currentColors.error}
                  onChange={(value) => setCurrentColors(prev => ({ ...prev, error: value }))}
                />
              </div>
            </Card>
          </div>

          {/* Preview Section */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(currentColors).map(([key, color]) => (
                <div key={key} className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg mb-2 shadow-sm border"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-sm font-medium capitalize">{key}</p>
                  <p className="text-xs text-gray-500 font-mono">{color}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button onClick={handlePreview} variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600">
              <Save className="w-4 h-4" />
              Save Palette
            </Button>
            <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button 
              onClick={() => setCurrentColors({
                primary: '#0ea5e9',
                secondary: '#a855f7',
                accent: '#14b8a6',
                success: '#22c55e',
                warning: '#f59e0b',
                error: '#ef4444'
              })}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-start gap-2">
            <Palette className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Advanced Features Coming Soon!
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                • Gradient support • Color harmony suggestions • Import/Export • Multiple custom slots • Color accessibility checker
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomPaletteBuilder;
