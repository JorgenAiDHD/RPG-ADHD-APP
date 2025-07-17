// Multiple Color Palettes System for ADHD App
export interface ColorPalette {
  name: string;
  id: string;
  description: string;
  primary: {
    50: string; 100: string; 200: string; 300: string; 400: string;
    500: string; 600: string; 700: string; 800: string; 900: string; 950: string;
  };
  secondary: {
    50: string; 100: string; 200: string; 300: string; 400: string;
    500: string; 600: string; 700: string; 800: string; 900: string; 950: string;
  };
  accent: {
    50: string; 100: string; 200: string; 300: string; 400: string;
    500: string; 600: string; 700: string; 800: string; 900: string; 950: string;
  };
  success: {
    50: string; 100: string; 200: string; 300: string; 400: string;
    500: string; 600: string; 700: string; 800: string; 900: string; 950: string;
  };
  warning: {
    50: string; 100: string; 200: string; 300: string; 400: string;
    500: string; 600: string; 700: string; 800: string; 900: string; 950: string;
  };
  error: {
    50: string; 100: string; 200: string; 300: string; 400: string;
    500: string; 600: string; 700: string; 800: string; 900: string; 950: string;
  };
  surface: {
    50: string; 100: string; 200: string; 300: string; 400: string;
    500: string; 600: string; 700: string; 800: string; 900: string; 950: string;
  };
  adhd: {
    focus: { 50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string; };
    calm: { 50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string; };
    energy: { 50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string; };
    creative: { 50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string; };
  };
}

// 1. ADHD-Friendly Palette (current - soothing blues and purples)
export const adhdFriendlyPalette: ColorPalette = {
  name: "ADHD-Friendly",
  id: "adhd-friendly",
  description: "Calming blues and purples designed to reduce overstimulation",
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49'
  },
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff', 
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764'
  },
  accent: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },
  surface: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  },
  adhd: {
    focus: {
      50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
      500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a'
    },
    calm: {
      50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
      500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d'
    },
    energy: {
      50: '#fef7ed', 100: '#feddd5', 200: '#feb8ab', 300: '#fd8c73', 400: '#fb5732',
      500: '#f53f3f', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337'
    },
    creative: {
      50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc',
      500: '#a855f7', 600: '#9333ea', 700: '#7c3aed', 800: '#6b21a8', 900: '#581c87'
    }
  }
};

// 2. Cyberpunk Palette (neon greens, magentas, electric blues)
export const cyberpunkPalette: ColorPalette = {
  name: "Cyberpunk",
  id: "cyberpunk",
  description: "High-energy neon colors for maximum digital immersion",
  primary: {
    50: '#f0feff',
    100: '#ccfeff',
    200: '#99fbff',
    300: '#5cf4ff',
    400: '#06e6ff',
    500: '#00d4ff',
    600: '#00a8cc',
    700: '#0086a6',
    800: '#086a80',
    900: '#0c5866',
    950: '#053b45'
  },
  secondary: {
    50: '#fef7ff',
    100: '#fceeff',
    200: '#f8ddff',
    300: '#f2bfff',
    400: '#e879ff',
    500: '#dd4bff',
    600: '#c628f0',
    700: '#a41cc7',
    800: '#8719a3',
    900: '#6f1a82',
    950: '#4a0a57'
  },
  accent: {
    50: '#f1fcf1',
    100: '#ddf9dd',
    200: '#bdf2be',
    300: '#8de68f',
    400: '#55d458',
    500: '#00ff41',
    600: '#00e63a',
    700: '#00b82e',
    800: '#059022',
    900: '#08751d',
    950: '#02410c'
  },
  success: {
    50: '#f1fcf1',
    100: '#ddf9dd',
    200: '#bdf2be',
    300: '#8de68f',
    400: '#55d458',
    500: '#00ff41',
    600: '#00e63a',
    700: '#00b82e',
    800: '#059022',
    900: '#08751d',
    950: '#02410c'
  },
  warning: {
    50: '#fffef7',
    100: '#fffce8',
    200: '#fff6c3',
    300: '#ffea8f',
    400: '#ffd749',
    500: '#ffbf00',
    600: '#ff9500',
    700: '#cc6600',
    800: '#a04d00',
    900: '#843d00',
    950: '#4a1f00'
  },
  error: {
    50: '#fff1f4',
    100: '#ffe1e8',
    200: '#ffc9d6',
    300: '#ff9fb5',
    400: '#ff6b8e',
    500: '#ff0066',
    600: '#e60059',
    700: '#c2004a',
    800: '#a1003e',
    900: '#870337',
    950: '#4b001a'
  },
  surface: {
    50: '#0a0a0f',
    100: '#141420',
    200: '#1f1f2e',
    300: '#2a2a3e',
    400: '#35354e',
    500: '#40405e',
    600: '#565682',
    700: '#6c6ca6',
    800: '#8585b8',
    900: '#a3a3cc',
    950: '#c2c2dd'
  },
  adhd: {
    focus: {
      50: '#f0feff', 100: '#ccfeff', 200: '#99fbff', 300: '#5cf4ff', 400: '#06e6ff',
      500: '#00d4ff', 600: '#00a8cc', 700: '#0086a6', 800: '#086a80', 900: '#0c5866'
    },
    calm: {
      50: '#f1fcf1', 100: '#ddf9dd', 200: '#bdf2be', 300: '#8de68f', 400: '#55d458',
      500: '#00ff41', 600: '#00e63a', 700: '#00b82e', 800: '#059022', 900: '#08751d'
    },
    energy: {
      50: '#fef7ff', 100: '#fceeff', 200: '#f8ddff', 300: '#f2bfff', 400: '#e879ff',
      500: '#dd4bff', 600: '#c628f0', 700: '#a41cc7', 800: '#8719a3', 900: '#6f1a82'
    },
    creative: {
      50: '#fff1f4', 100: '#ffe1e8', 200: '#ffc9d6', 300: '#ff9fb5', 400: '#ff6b8e',
      500: '#ff0066', 600: '#e60059', 700: '#c2004a', 800: '#a1003e', 900: '#870337'
    }
  }
};

// 3. Warm Gradient Palette (oranges, corals, warm pinks)
export const warmGradientPalette: ColorPalette = {
  name: "Warm Gradient",
  id: "warm-gradient",
  description: "Warm, energizing gradients with coral and sunset tones",
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407'
  },
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
    950: '#500724'
  },
  accent: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
    950: '#4c0519'
  },
  success: {
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#a3e635',
    500: '#84cc16',
    600: '#65a30d',
    700: '#4d7c0f',
    800: '#3f6212',
    900: '#365314',
    950: '#1a2e05'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },
  surface: {
    50: '#fdfcfb',
    100: '#faf8f6',
    200: '#f5f1ed',
    300: '#ede6de',
    400: '#e1d6ca',
    500: '#d1c0ae',
    600: '#bfa490',
    700: '#a68a75',
    800: '#8a7162',
    900: '#725e52',
    950: '#3a2f2a'
  },
  adhd: {
    focus: {
      50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c',
      500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12'
    },
    calm: {
      50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6',
      500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843'
    },
    energy: {
      50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185',
      500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337'
    },
    creative: {
      50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c',
      500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12'
    }
  }
};

// 4. Forest Theme Palette (natural greens and earth tones)
export const forestThemePalette: ColorPalette = {
  name: "Forest Theme",
  id: "forest-theme", 
  description: "Calming natural greens and earth tones inspired by forest environments",
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  secondary: {
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#a3e635',
    500: '#84cc16',
    600: '#65a30d',
    700: '#4d7c0f',
    800: '#3f6212',
    900: '#365314',
    950: '#1a2e05'
  },
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  warning: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },
  surface: {
    50: '#fafaf9',
    100: '#f4f4f3',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09'
  },
  adhd: {
    focus: {
      50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
      500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d'
    },
    calm: {
      50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635',
      500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212', 900: '#365314'
    },
    energy: {
      50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15',
      500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12'
    },
    creative: {
      50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
      500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d'
    }
  }
};

// Available palettes array
export const availablePalettes: ColorPalette[] = [
  adhdFriendlyPalette,
  cyberpunkPalette,
  warmGradientPalette,
  forestThemePalette
];

// Function to apply color palette to CSS variables
export const applyColorPalette = (palette: ColorPalette) => {
  const root = document.documentElement;
  
  // Apply primary colors
  Object.entries(palette.primary).forEach(([shade, color]) => {
    root.style.setProperty(`--primary-${shade}`, color.replace('#', ''));
  });
  
  // Apply secondary colors
  Object.entries(palette.secondary).forEach(([shade, color]) => {
    root.style.setProperty(`--secondary-${shade}`, color.replace('#', ''));
  });
  
  // Apply accent colors
  Object.entries(palette.accent).forEach(([shade, color]) => {
    root.style.setProperty(`--accent-${shade}`, color.replace('#', ''));
  });
  
  // Apply success colors
  Object.entries(palette.success).forEach(([shade, color]) => {
    root.style.setProperty(`--success-${shade}`, color.replace('#', ''));
  });
  
  // Apply warning colors
  Object.entries(palette.warning).forEach(([shade, color]) => {
    root.style.setProperty(`--warning-${shade}`, color.replace('#', ''));
  });
  
  // Apply error colors
  Object.entries(palette.error).forEach(([shade, color]) => {
    root.style.setProperty(`--error-${shade}`, color.replace('#', ''));
  });
  
  // Apply surface colors
  Object.entries(palette.surface).forEach(([shade, color]) => {
    root.style.setProperty(`--surface-${shade}`, color.replace('#', ''));
  });
  
  // Apply ADHD-specific colors
  Object.entries(palette.adhd.focus).forEach(([shade, color]) => {
    root.style.setProperty(`--adhd-focus-${shade}`, color.replace('#', ''));
  });
  
  Object.entries(palette.adhd.calm).forEach(([shade, color]) => {
    root.style.setProperty(`--adhd-calm-${shade}`, color.replace('#', ''));
  });
  
  Object.entries(palette.adhd.energy).forEach(([shade, color]) => {
    root.style.setProperty(`--adhd-energy-${shade}`, color.replace('#', ''));
  });
  
  Object.entries(palette.adhd.creative).forEach(([shade, color]) => {
    root.style.setProperty(`--adhd-creative-${shade}`, color.replace('#', ''));
  });
  
  // Store current palette in localStorage
  localStorage.setItem('selectedColorPalette', palette.id);
};

// Function to get saved palette
export const getSavedPalette = (): ColorPalette => {
  const savedPaletteId = localStorage.getItem('selectedColorPalette');
  return availablePalettes.find(p => p.id === savedPaletteId) || adhdFriendlyPalette;
};
