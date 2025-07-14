import type { Collectible } from '../types/game';
// Logika generowania przedmiotów kolekcjonerskich.
export const CollectibleSystem = {
  // Definicje szablonów przedmiotów kolekcjonerskich
  COLLECTIBLE_TEMPLATES: {
    knowledge: [
      { name: 'Ancient Scroll', description: 'A fragment of forgotten wisdom.', xpValue: 10, rarity: 'common', icon: '📜' },
      { name: 'Tome of Insight', description: 'Deep knowledge from an old book.', xpValue: 15, rarity: 'uncommon', icon: '📖' },
      { name: 'Blueprint of Understanding', description: 'A rare diagram revealing complex concepts.', xpValue: 25, rarity: 'rare', icon: '📐' },
    ],
    skill: [
      { name: 'Honed Blade', description: 'Represents a sharpened skill.', xpValue: 15, rarity: 'uncommon', icon: '🔪', skillPoints: 1 },
      { name: 'Masterwork Tool', description: 'A tool crafted with exceptional skill.',
      xpValue: 25, rarity: 'rare', icon: '🛠️', skillPoints: 2 },
      { name: 'Virtuoso\'s Touch', description: 'A legendary item symbolizing peak performance.', xpValue: 40, rarity: 'epic', icon: '✨', skillPoints: 3 },
    ],
    insight: [
      { name: 'Spark of Idea', description: 'A sudden, small realization.', xpValue: 10, rarity: 'common', icon: '💡' },
      { name: 'Moment of Clarity', description: 'A deeper understanding of a complex issue.', xpValue: 20, rarity: 'uncommon', icon: '🧠' },
      { name: 'Epiphany Crystal', description: 'A profound breakthrough in perspective.', xpValue: 30, rarity: 'rare', icon: '💎' },
    ],
  },
  // Generuje losowy przedmiot kolekcjonerski danego typu
  generateRandomCollectible: (type: 'knowledge' |
  'skill' | 'insight'): Omit<Collectible, 'id' | 'dateCollected'> => {
    const templates = CollectibleSystem.COLLECTIBLE_TEMPLATES[type];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return {
      name: randomTemplate.name,
      type: type,
      xpValue: randomTemplate.xpValue,
      rarity: randomTemplate.rarity as 'common' | 'uncommon' | 'rare' | 'epic',
      description: randomTemplate.description,
      category: type === 'knowledge' ?
        'Learning' : type === 'skill' ? 'Mastery' : 'Self-Reflection',
      skillPoints: 'skillPoints' in randomTemplate ? (randomTemplate as any).skillPoints : undefined,
      icon: randomTemplate.icon || undefined,
    };
  },
};
