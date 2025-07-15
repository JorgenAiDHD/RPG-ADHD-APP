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
