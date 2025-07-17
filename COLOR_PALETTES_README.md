# 🎨 Color Palette System - Dokumentacja

Nowy system palet kolorów umożliwia użytkownikom personalizację wyglądu aplikacji RPG Quest Log zgodnie z ich preferencjami i nastrojem.

## 🌈 Dostępne Palety Kolorów

### 1. **ADHD-Friendly** (Domyślna)
- **Główne kolory**: Uspokajające niebieskie i fioletowe
- **Charakterystyka**: Zaprojektowana specjalnie dla osób z ADHD
- **Zalety**: Redukuje przystymulowanie, wspomaga koncentrację
- **Ikona**: ✨ Sparkles

### 2. **Cyberpunk**
- **Główne kolory**: Neonowe zielenie, magentas, elektryczne niebieskie
- **Charakterystyka**: Wysokoenergetyczne kolory neonowe
- **Zalety**: Maksymalna immersja cyfrowa, energetyzujące
- **Ikona**: ⚡ Zap

### 3. **Warm Gradient**
- **Główne kolory**: Pomarańcze, korale, ciepłe różowe
- **Charakterystyka**: Ciepłe, energetyzujące gradienty
- **Zalety**: Zachęcające, przyjazne, motywujące
- **Ikona**: ❤️ Heart

### 4. **Forest Theme**
- **Główne kolory**: Naturalne zielenie i ziemiste tony
- **Charakterystyka**: Inspirowane środowiskiem leśnym
- **Zalety**: Spokojne, naturalne, relaksujące
- **Ikona**: 🌲 TreePine

## 🔧 Funkcjonalności

### Wybór Palety
- **Dostęp**: Przycisk "Color Themes" w głównej nawigacji
- **Podgląd**: Możliwość podglądu przed zastosowaniem
- **Instant Apply**: Natychmiastowe zastosowanie wybranej palety
- **Persistencja**: Automatyczne zapisywanie preferencji

### System Kolorów
- **200+ tokenów designu** - Kompletne pokrycie wszystkich elementów
- **ADHD-optimized** - Specjalne kolory dla stanów uwagi:
  - Focus (koncentracja)
  - Calm (spokój)
  - Energy (energia)
  - Creative (kreatywność)
- **Dark/Light Mode** - Automatyczne dopasowanie do motywu
- **Responsive Design** - Wszystkie palety działają na wszystkich urządzeniach

## 🎯 Korzyści ADHD

### Redukcja Rozproszenia
- Spójne kolory eliminują "chaos wizualny"
- Ujednolicona hierarchia wizualna
- Mniej decyzji kognitywnych

### Boost Dopaminy
- Kolory dopasowane do stanów emocjonalnych
- Natychmiastowy feedback wizualny
- Pozytywne wzmocnienia przez kolory

### Personalizacja
- Wybór palety według aktualnego nastroju
- Dostosowanie do indywidualnych preferencji
- Możliwość zmiany w zależności od zadania

## 🚀 Przyszłe Funkcjonalności

### Custom Palette Builder (W Rozwoju)
- **Kreator kolorów** - Tworzenie własnych palet
- **Gradient Support** - Wsparcie dla gradientów
- **Color Harmony** - Automatyczne sugestie harmonii kolorów
- **Import/Export** - Dzielenie się paletami z innymi
- **Multiple Slots** - Zapisywanie wielu własnych palet
- **Accessibility Checker** - Sprawdzanie kontrastu i dostępności

### Smart Recommendations
- **Mood-based suggestions** - Sugerowanie palet na podstawie nastroju
- **Time-based changes** - Automatyczne przełączanie palet w ciągu dnia
- **Activity-based themes** - Różne palety dla różnych typów zadań

## 🛠️ Implementacja Techniczna

### Architektura
```typescript
// Struktura palety kolorów
interface ColorPalette {
  name: string;
  id: string;
  description: string;
  primary: ColorShades;    // Główne kolory marki
  secondary: ColorShades;  // Drugorzędne kolory
  accent: ColorShades;     // Kolory akcentujące
  success: ColorShades;    // Kolory sukcesu
  warning: ColorShades;    // Kolory ostrzeżeń
  error: ColorShades;      // Kolory błędów
  surface: ColorShades;    // Kolory powierzchni
  adhd: ADHDColors;        // Specjalne kolory ADHD
}
```

### CSS Variables
Wszystkie kolory są automatycznie konwertowane na CSS custom properties:
```css
:root {
  --primary-500: 14 165 233;
  --secondary-500: 168 85 247;
  --adhd-focus-500: 59 130 246;
  /* ... i wiele więcej */
}
```

### Utility Classes
Nowe klasy CSS dla szybkiego stylowania:
```css
.card-primary { /* Główne karty */ }
.btn-primary-adhd { /* Przyciski z feedback ADHD */ }
.badge-attention-focus { /* Odznaki skupienia */ }
.progress-primary { /* Paski postępu */ }
```

## 📱 Użytkowanie

### Dla Użytkowników
1. Kliknij "Color Themes" w górnej nawigacji
2. Przeglądaj dostępne palety z opisami
3. Użyj "Preview" aby zobaczyć efekt
4. Kliknij "Apply" aby zastosować na stałe
5. Twoje preferencje są automatycznie zapisywane

### Dla Deweloperów
```typescript
import { applyColorPalette, availablePalettes } from '../styles/colorPalettes';

// Zastosuj paletę
applyColorPalette(cyberpunkPalette);

// Pobierz zapisaną paletę
const savedPalette = getSavedPalette();
```

## 🎨 Design Principles

### ADHD-Pierwszość
- Każda paleta jest testowana pod kątem ADHD
- Unikanie przytłaczających kombinacji
- Wspieranie różnych stanów koncentracji

### Accessibility First
- Minimum 4.5:1 ratio kontrastu
- Sprawdzanie daltonizmu
- Wsparcie dla screen readerów

### Emotional Design
- Kolory wzbudzające odpowiednie emocje
- Wsparcie dla różnych nastrojów
- Poprawa motywacji poprzez kolory

---

*Ostatnia aktualizacja: 17 lipca 2025*
*System palet kolorów v1.0 - Kompletne wsparcie dla personalizacji ADHD-friendly*
