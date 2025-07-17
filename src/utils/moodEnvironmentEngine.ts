// v0.3 Inner Realms Expansion - Mood Environment Engine 🎨
import { EmotionRealm, MoodEnvironmentSync } from '../types/game';

export class MoodEnvironmentEngine {
  private static transitionInProgress = false;
  private static currentEnvironment: EmotionRealm['environment'] | null = null;

  // Initialize the mood environment system
  static initialize(realms: EmotionRealm[]): void {
    // Set up CSS custom properties for realm themes
    this.setupCSSVariables();
    
    // Apply default realm environment
    const defaultRealm = realms.find(realm => realm.isUnlocked) || realms[0];
    if (defaultRealm) {
      this.applyEnvironment(defaultRealm.environment, false);
    }
  }

  // Apply mood-based environment changes with smooth transitions
  static async applyMoodEnvironment(
    mood: number,
    currentEmotion: EmotionRealm['emotionType'],
    realms: EmotionRealm[],
    enableTransition = true
  ): Promise<MoodEnvironmentSync> {
    // Find target realm based on emotion
    const targetRealm = realms.find(realm => 
      realm.emotionType === currentEmotion && realm.isUnlocked
    );

    if (!targetRealm) {
      // Fallback to default neutral environment
      return this.createNeutralEnvironmentSync(mood, currentEmotion);
    }

    // Check if transition is needed
    const needsTransition = enableTransition && 
      this.currentEnvironment && 
      this.isDifferentEnvironment(this.currentEnvironment, targetRealm.environment);

    if (needsTransition && !this.transitionInProgress) {
      await this.smoothEnvironmentTransition(targetRealm.environment);
    } else {
      this.applyEnvironment(targetRealm.environment, false);
    }

    // Create mood environment sync object
    const sync: MoodEnvironmentSync = {
      currentMood: mood,
      currentEmotion: currentEmotion,
      activeRealm: targetRealm.id,
      transitionDuration: needsTransition ? 2 : 0,
      lastMoodUpdate: new Date()
    };

    return sync;
  }

  // Apply environment immediately without transition
  private static applyEnvironment(environment: EmotionRealm['environment'], fade = false): void {
    const root = document.documentElement;
    
    if (fade) {
      root.style.transition = 'all 0.3s ease-in-out';
    } else {
      root.style.transition = '';
    }

    // Apply background gradient
    root.style.setProperty('--realm-bg-gradient', environment.bgColor);
    
    // Apply text colors
    root.style.setProperty('--realm-text-color', this.extractColorFromClass(environment.textColor));
    
    // Apply accent color
    root.style.setProperty('--realm-accent-color', this.extractColorFromClass(environment.accentColor));
    
    // Apply ambient effects
    this.applyAmbientEffect(environment.ambientEffect);
    
    // Update body classes for theme
    this.updateBodyClasses(environment);
    
    this.currentEnvironment = environment;
    
    // Clear transition after application
    if (fade) {
      setTimeout(() => {
        root.style.transition = '';
      }, 300);
    }
  }

  // Smooth transition between environments
  private static async smoothEnvironmentTransition(newEnvironment: EmotionRealm['environment']): Promise<void> {
    if (this.transitionInProgress) return;
    
    this.transitionInProgress = true;
    
    try {
      // Phase 1: Fade out current environment (0.5s)
      await this.fadeOutCurrentEnvironment();
      
      // Phase 2: Apply new environment (instant)
      this.applyEnvironment(newEnvironment, false);
      
      // Phase 3: Fade in new environment (1.5s)
      await this.fadeInNewEnvironment();
      
    } finally {
      this.transitionInProgress = false;
    }
  }

  // Fade out current environment
  private static fadeOutCurrentEnvironment(): Promise<void> {
    return new Promise(resolve => {
      const root = document.documentElement;
      root.style.transition = 'opacity 0.5s ease-in-out';
      root.style.opacity = '0.7';
      
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  // Fade in new environment
  private static fadeInNewEnvironment(): Promise<void> {
    return new Promise(resolve => {
      const root = document.documentElement;
      root.style.transition = 'opacity 1.5s ease-in-out';
      root.style.opacity = '1';
      
      setTimeout(() => {
        root.style.transition = '';
        resolve();
      }, 1500);
    });
  }

  // Apply ambient effects (fog, clarity, sparkles, etc.)
  private static applyAmbientEffect(effect: EmotionRealm['environment']['ambientEffect']): void {
    // Remove existing ambient effects
    this.clearAmbientEffects();
    
    switch (effect) {
      case 'fog':
        this.createFogEffect();
        break;
      case 'clarity':
        this.createClarityEffect();
        break;
      case 'sparkles':
        this.createSparklesEffect();
        break;
      case 'rain':
        this.createRainEffect();
        break;
      case 'sunshine':
        this.createSunshineEffect();
        break;
      case 'storm':
        this.createStormEffect();
        break;
      case 'aurora':
        this.createAuroraEffect();
        break;
    }
  }

  // Clear all ambient effects
  private static clearAmbientEffects(): void {
    const effectContainer = document.getElementById('ambient-effects-container');
    if (effectContainer) {
      effectContainer.innerHTML = '';
    } else {
      // Create effects container if it doesn't exist
      const container = document.createElement('div');
      container.id = 'ambient-effects-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
      `;
      document.body.appendChild(container);
    }
  }

  // Create fog effect for anxiety/shadowlands
  private static createFogEffect(): void {
    const container = document.getElementById('ambient-effects-container')!;
    const fog = document.createElement('div');
    fog.className = 'fog-effect';
    fog.style.cssText = `
      position: absolute;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
      animation: fogDrift 20s ease-in-out infinite;
      opacity: 0.6;
    `;
    
    // Add fog animation keyframes if not exists
    this.addCSSKeyframes('fogDrift', `
      0%, 100% { transform: translate(-25%, -25%) rotate(0deg); }
      25% { transform: translate(-20%, -30%) rotate(90deg); }
      50% { transform: translate(-30%, -20%) rotate(180deg); }
      75% { transform: translate(-15%, -25%) rotate(270deg); }
    `);
    
    container.appendChild(fog);
  }

  // Create clarity effect for focus/clarity peaks
  private static createClarityEffect(): void {
    const container = document.getElementById('ambient-effects-container')!;
    const clarity = document.createElement('div');
    clarity.className = 'clarity-effect';
    clarity.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(167, 243, 208, 0.05) 100%);
      animation: clarityPulse 4s ease-in-out infinite;
    `;
    
    this.addCSSKeyframes('clarityPulse', `
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.02); }
    `);
    
    container.appendChild(clarity);
  }

  // Create sparkles effect for creativity/cosmos
  private static createSparklesEffect(): void {
    const container = document.getElementById('ambient-effects-container')!;
    
    // Create multiple sparkle elements
    for (let i = 0; i < 15; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-effect';
      sparkle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(236, 72, 153, 0.8);
        border-radius: 50%;
        animation: sparkleFloat ${3 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;
      
      container.appendChild(sparkle);
    }
    
    this.addCSSKeyframes('sparkleFloat', `
      0%, 100% { opacity: 0; transform: translateY(0px) scale(0.5); }
      50% { opacity: 1; transform: translateY(-20px) scale(1); }
    `);
  }

  // Create rain effect for calm/serenity gardens
  private static createRainEffect(): void {
    const container = document.getElementById('ambient-effects-container')!;
    
    // Create rain drops
    for (let i = 0; i < 20; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.cssText = `
        position: absolute;
        width: 2px;
        height: 20px;
        background: linear-gradient(transparent, rgba(34, 197, 94, 0.6));
        animation: rainFall ${1 + Math.random() * 2}s linear infinite;
        animation-delay: ${Math.random() * 2}s;
        left: ${Math.random() * 100}%;
        top: -20px;
      `;
      
      container.appendChild(drop);
    }
    
    this.addCSSKeyframes('rainFall', `
      to { transform: translateY(100vh); }
    `);
  }

  // Create sunshine effect for energy/vitality fields
  private static createSunshineEffect(): void {
    const container = document.getElementById('ambient-effects-container')!;
    const sunshine = document.createElement('div');
    sunshine.className = 'sunshine-effect';
    sunshine.style.cssText = `
      position: absolute;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%);
      border-radius: 50%;
      top: 10%;
      right: 10%;
      animation: sunshineGlow 6s ease-in-out infinite;
    `;
    
    this.addCSSKeyframes('sunshineGlow', `
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    `);
    
    container.appendChild(sunshine);
  }

  // Create storm effect for motivation/champions arena
  private static createStormEffect(): void {
    const container = document.getElementById('ambient-effects-container')!;
    const storm = document.createElement('div');
    storm.className = 'storm-effect';
    storm.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, rgba(239, 68, 68, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%);
      animation: stormFlash 3s ease-in-out infinite;
    `;
    
    this.addCSSKeyframes('stormFlash', `
      0%, 90%, 100% { opacity: 0.2; }
      5%, 85% { opacity: 0.6; }
      10%, 80% { opacity: 0.3; }
    `);
    
    container.appendChild(storm);
  }

  // Create aurora effect for confidence/confidence castle
  private static createAuroraEffect(): void {
    const container = document.getElementById('ambient-effects-container')!;
    const aurora = document.createElement('div');
    aurora.className = 'aurora-effect';
    aurora.style.cssText = `
      position: absolute;
      width: 100%;
      height: 60%;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(129, 140, 248, 0.3) 25%, 
        rgba(167, 139, 250, 0.3) 50%, 
        rgba(236, 72, 153, 0.3) 75%, 
        transparent 100%);
      top: 0;
      animation: auroraWave 8s ease-in-out infinite;
    `;
    
    this.addCSSKeyframes('auroraWave', `
      0%, 100% { transform: translateX(-100%) skewX(-10deg); opacity: 0.4; }
      50% { transform: translateX(100%) skewX(10deg); opacity: 0.8; }
    `);
    
    container.appendChild(aurora);
  }

  // Helper: Add CSS keyframes if they don't exist
  private static addCSSKeyframes(name: string, keyframes: string): void {
    const styleId = `keyframes-${name}`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `@keyframes ${name} { ${keyframes} }`;
      document.head.appendChild(style);
    }
  }

  // Setup CSS custom properties for realm themes
  private static setupCSSVariables(): void {
    const root = document.documentElement;
    
    // Default theme properties
    root.style.setProperty('--realm-bg-gradient', 'from-gray-50 to-gray-100');
    root.style.setProperty('--realm-text-color', 'rgb(17, 24, 39)');
    root.style.setProperty('--realm-accent-color', 'rgb(59, 130, 246)');
  }

  // Update body classes for theme consistency
  private static updateBodyClasses(environment: EmotionRealm['environment']): void {
    const body = document.body;
    
    // Remove existing realm classes
    body.classList.forEach(className => {
      if (className.startsWith('realm-')) {
        body.classList.remove(className);
      }
    });
    
    // Add new realm classes
    body.classList.add('realm-active');
    
    // Add specific theme classes
    if (environment.textColor.includes('white')) {
      body.classList.add('realm-dark-theme');
    } else {
      body.classList.add('realm-light-theme');
    }
  }

  // Extract color values from Tailwind classes
  private static extractColorFromClass(className: string): string {
    const colorMap: Record<string, string> = {
      'text-purple-100': 'rgb(243, 232, 255)',
      'text-blue-900': 'rgb(30, 58, 138)',
      'text-white': 'rgb(255, 255, 255)',
      'text-green-800': 'rgb(22, 101, 52)',
      'text-orange-900': 'rgb(154, 52, 18)',
      'text-gray-900': 'rgb(17, 24, 39)',
      'border-purple-500': 'rgb(168, 85, 247)',
      'border-blue-600': 'rgb(37, 99, 235)',
      'border-pink-400': 'rgb(244, 114, 182)',
      'border-green-500': 'rgb(34, 197, 94)',
      'border-yellow-600': 'rgb(202, 138, 4)',
      'border-red-400': 'rgb(248, 113, 113)',
      'border-indigo-400': 'rgb(129, 140, 248)',
      'border-blue-500': 'rgb(59, 130, 246)'
    };
    
    return colorMap[className] || 'rgb(59, 130, 246)';
  }

  // Check if environments are different enough to warrant transition
  private static isDifferentEnvironment(
    current: EmotionRealm['environment'], 
    target: EmotionRealm['environment']
  ): boolean {
    return current.bgColor !== target.bgColor || 
           current.ambientEffect !== target.ambientEffect;
  }

  // Create neutral environment sync for fallback
  private static createNeutralEnvironmentSync(
    mood: number, 
    emotion: EmotionRealm['emotionType']
  ): MoodEnvironmentSync {
    return {
      currentMood: mood,
      currentEmotion: emotion,
      activeRealm: null,
      transitionDuration: 0,
      lastMoodUpdate: new Date()
    };
  }

  // Get current environment state
  static getCurrentEnvironment(): EmotionRealm['environment'] | null {
    return this.currentEnvironment;
  }

  // Check if transition is in progress
  static isTransitioning(): boolean {
    return this.transitionInProgress;
  }
}

export default MoodEnvironmentEngine;
