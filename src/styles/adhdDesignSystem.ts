// Unified ADHD-Friendly Design System
// This file contains the complete design token system for consistent UI/UX

export const ADHDFriendlyDesign = {
  // Core Color Palette - ADHD-optimized colors
  colors: {
    // Primary Brand Colors - Energizing but not overwhelming
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe', 
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Main brand blue
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    },
    
    // Secondary - Creativity and Focus
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff', 
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Main purple
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87'
    },
    
    // Success - Dopamine-triggering green
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Main success green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    },
    
    // Warning - Energizing but safe orange
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main warning orange
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    },
    
    // Danger - Clear but not anxiety-inducing red
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main danger red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'
    },
    
    // Neutrals - Calming grays
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    
    // ADHD-specific emotional states
    focus: {
      light: '#dbeafe', // Light blue for focus state
      main: '#3b82f6',
      dark: '#1d4ed8'
    },
    
    calm: {
      light: '#d1fae5', // Light green for calm state
      main: '#10b981',
      dark: '#047857'
    },
    
    energy: {
      light: '#fed7d7', // Light red for energy state
      main: '#f56565',
      dark: '#c53030'
    },
    
    creative: {
      light: '#e9d5ff', // Light purple for creative state
      main: '#8b5cf6',
      dark: '#6d28d9'
    }
  },
  
  // Typography Scale - ADHD-friendly
  typography: {
    // Font families
    fonts: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
      display: '"Inter", system-ui, sans-serif'
    },
    
    // Font sizes - Slightly larger for readability
    sizes: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px  
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
      '8xl': '6rem'      // 96px
    },
    
    // Line heights - Optimized for ADHD readability
    lineHeights: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    
    // Font weights
    weights: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    }
  },
  
  // Spacing System - Consistent and predictable
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem'       // 384px
  },
  
  // Border Radius - Friendly and modern
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },
  
  // Shadow System - Depth and focus
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    
    // Special ADHD-friendly focus shadows
    focus: '0 0 0 3px rgb(59 130 246 / 0.5)',
    success: '0 0 0 3px rgb(34 197 94 / 0.5)',
    warning: '0 0 0 3px rgb(245 158 11 / 0.5)',
    danger: '0 0 0 3px rgb(239 68 68 / 0.5)'
  },
  
  // Animation & Transitions - Smooth but responsive
  animations: {
    durations: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms'
    },
    
    easings: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      
      // Custom ADHD-friendly easings
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  },
  
  // Component Variants - Consistent styling
  components: {
    button: {
      sizes: {
        xs: { padding: '6px 12px', fontSize: '12px', height: '28px' },
        sm: { padding: '8px 16px', fontSize: '14px', height: '36px' },
        md: { padding: '10px 20px', fontSize: '16px', height: '44px' },
        lg: { padding: '12px 24px', fontSize: '18px', height: '52px' },
        xl: { padding: '16px 32px', fontSize: '20px', height: '60px' }
      },
      
      variants: {
        primary: {
          background: 'var(--primary-500)',
          color: 'white',
          hover: 'var(--primary-600)',
          focus: 'var(--primary-700)'
        },
        secondary: {
          background: 'var(--secondary-500)', 
          color: 'white',
          hover: 'var(--secondary-600)',
          focus: 'var(--secondary-700)'
        },
        success: {
          background: 'var(--success-500)',
          color: 'white', 
          hover: 'var(--success-600)',
          focus: 'var(--success-700)'
        },
        outline: {
          background: 'transparent',
          border: '2px solid var(--neutral-300)',
          color: 'var(--neutral-700)',
          hover: 'var(--neutral-50)'
        }
      }
    },
    
    card: {
      variants: {
        default: {
          background: 'white',
          border: '1px solid var(--neutral-200)',
          borderRadius: 'var(--radius-xl)',
          shadow: 'var(--shadow-md)'
        },
        elevated: {
          background: 'white',
          border: 'none',
          borderRadius: 'var(--radius-2xl)',
          shadow: 'var(--shadow-xl)'
        },
        focus: {
          background: 'var(--focus-light)',
          border: '2px solid var(--focus-main)',
          borderRadius: 'var(--radius-xl)',
          shadow: 'var(--shadow-focus)'
        }
      }
    }
  },
  
  // Layout Grid - Responsive and consistent
  grid: {
    columns: 12,
    gutters: {
      xs: '1rem',
      sm: '1.5rem', 
      md: '2rem',
      lg: '2.5rem',
      xl: '3rem'
    },
    
    containers: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  
  // ADHD-Specific Design Patterns
  adhd: {
    // Colors for different attention states
    attentionStates: {
      hyperfocus: {
        primary: '#3b82f6',
        secondary: '#1d4ed8',
        background: '#dbeafe'
      },
      scattered: {
        primary: '#f59e0b',
        secondary: '#d97706', 
        background: '#fef3c7'
      },
      overwhelmed: {
        primary: '#6b7280',
        secondary: '#4b5563',
        background: '#f9fafb'
      },
      energized: {
        primary: '#10b981',
        secondary: '#047857',
        background: '#d1fae5'
      }
    },
    
    // Visual hierarchy helpers
    emphasis: {
      low: { opacity: '0.6', fontWeight: '400' },
      medium: { opacity: '0.8', fontWeight: '500' },
      high: { opacity: '1', fontWeight: '600' },
      critical: { opacity: '1', fontWeight: '700', color: 'var(--primary-600)' }
    },
    
    // Interaction feedback
    feedback: {
      success: {
        color: 'var(--success-600)',
        background: 'var(--success-50)',
        icon: '✅'
      },
      progress: {
        color: 'var(--primary-600)',
        background: 'var(--primary-50)',
        icon: '⏳'
      },
      achievement: {
        color: 'var(--warning-600)',
        background: 'var(--warning-50)',
        icon: '🏆'
      }
    }
  }
};

// CSS Custom Properties Generator
export const generateCSSCustomProperties = () => {
  const design = ADHDFriendlyDesign;
  let css = ':root {\n';
  
  // Generate color custom properties
  Object.entries(design.colors).forEach(([colorName, colorValues]) => {
    if (typeof colorValues === 'object' && colorValues !== null) {
      Object.entries(colorValues).forEach(([shade, value]) => {
        css += `  --${colorName}-${shade}: ${value};\n`;
      });
    }
  });
  
  // Generate spacing custom properties
  Object.entries(design.spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });
  
  // Generate typography custom properties
  Object.entries(design.typography.sizes).forEach(([key, value]) => {
    css += `  --text-${key}: ${value};\n`;
  });
  
  css += '}\n';
  return css;
};

export default ADHDFriendlyDesign;
