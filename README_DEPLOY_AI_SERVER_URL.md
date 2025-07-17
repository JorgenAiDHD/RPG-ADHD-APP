# RPG ADHD APP – Instrukcja uruchomienia i testowania

## 1. Wymagania
- Node.js 18+
- Konto Railway (do deployu 24/7)
- Konto GitHub (do hostingu frontendu na GitHub Pages)
- (Opcjonalnie) ngrok – do testów lokalnych

---

## 2. Uruchomienie backendu lokalnie

```bash
cd server
npm install
node server.js
```

- Backend domyślnie działa na porcie 3001.
- Endpointy:
  - `GET /` – info o API
  - `GET /status` – status serwera
  - `GET /gameState` – aktualny stan gry
  - `POST /chat` – endpoint AI

---

## 3. Testowanie endpointów lokalnie

Użyj pliku `server/test_backend.http` w VS Code (REST Client) lub Postmanie.

---

## 4. Testowanie z ngrok (dostęp z internetu)

1. Uruchom backend lokalnie (patrz wyżej).
2. W nowym terminalu uruchom:
   ```bash
   ngrok http 3001
   ```
3. Skopiuj wygenerowany adres (np. `https://xxxx.ngrok-free.app`).
4. Ustaw ten adres jako `VITE_AI_SERVER_URL` w GitHub Pages (repo → Settings → Secrets and variables → Actions).
5. Zrób pusty commit, aby zdeployować frontend.
6. Otwórz stronę na GitHub Pages i testuj.

---

## 5. Deploy backendu na Railway (24/7)

1. Wejdź na https://railway.app i zaloguj się.
2. Stwórz nowy projekt i połącz repozytorium.
3. Railway automatycznie wykryje katalog `server/` i plik `server.js`.
4. W zakładce "Variables" dodaj:
   - `GEMINI_API_KEY` (Twój klucz do Gemini)
5. Po deployu skopiuj publiczny adres Railway (np. `https://twoj-backend.up.railway.app`).
6. Ustaw ten adres jako `VITE_AI_SERVER_URL` w GitHub Pages.
7. Zrób pusty commit, aby zdeployować frontend.
8. Otwórz stronę na GitHub Pages i testuj.

---

## 6. Najczęstsze problemy i rozwiązania

- **CORS error:**
  - Upewnij się, że backend działa i allowedOrigins zawiera Twój frontend (GitHub Pages).
  - Sprawdź, czy ngrok tuneluje właściwy port (3001).
  - Sprawdź logi backendu i Railway.

- **404 na /status:**
  - Backend nie działa lub ngrok tuneluje zły port.
  - Sprawdź, czy backend loguje połączenia.

- **Network Error w AICompanion:**
  - Sprawdź, czy `VITE_AI_SERVER_URL` jest poprawny i backend jest online.

---

## 7. Dodatkowe narzędzia

- Plik `server/test_backend.http` – testowanie endpointów przez REST Client/Postman.
- Railway – do hostowania backendu 24/7.
- ngrok – do testów lokalnych z dostępem z internetu.

---

## 8. Kontakt i wsparcie

Jeśli pojawią się błędy lub chcesz rozwinąć aplikację – napisz issue w repozytorium lub skontaktuj się przez GitHub.

---

**Powodzenia!**
# Jak poprawnie ustawić publiczny URL backendu dla GitHub Pages

1. Wejdź na GitHub → Settings → Secrets → Actions.
2. Ustaw/zmień sekret o nazwie:
   
   **AI_SERVER_PUBLIC_URL**

   na swój aktualny publiczny ngrok URL, np.:

   https://39a231890547.ngrok-free.app

3. W pliku `.github/workflows/deploy.yml` dodaj do kroku `Build 🏗️`:

   ```yaml
   env:
     NODE_ENV: production
     VITE_AI_SERVER_URL: ${{ secrets.AI_SERVER_PUBLIC_URL }}
   ```

   Przykład:
   ```yaml
   - name: Build 🏗️
     run: npm run build
     env:
       NODE_ENV: production
       VITE_AI_SERVER_URL: ${{ secrets.AI_SERVER_PUBLIC_URL }}
   ```

4. W pliku frontendowym (np. AICompanion.tsx) używaj:
   ```js
   const serverUrl = import.meta.env.VITE_AI_SERVER_URL || "http://localhost:3001";
   ```
   Dzięki temu build na GitHub Pages zawsze będzie miał aktualny URL backendu.

5. Po każdej zmianie kodu lub sekretu wykonaj:
   ```
   git add .
   git commit -m "fix: update backend URL and workflow"
   git push
   ```
   To uruchomi nowy deploy na GitHub Pages.

---

**Pamiętaj:**
- Po restarcie ngrok musisz zaktualizować sekret i wykonać deploy ponownie!
- Jeśli pojawi się błąd 500 na backendzie, skopiuj pełny log z terminala i wklej tutaj.
