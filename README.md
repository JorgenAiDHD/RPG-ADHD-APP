# My RPG Quest Log

## Features

- **Quest System**: Transform tasks into quests with customizable difficulty, priority, and rewards
- **Focus Timer**: Built-in Pomodoro timer with ADHD-friendly features
- **XP and Gold**: Earn rewards for completing tasks to level up your character
- **Streaks**: Build consistent habits with a streak system
- **AI Companion**: Get personalized assistance with your tasks and productivity
- **Skill Tree**: Unlock abilities and perks as you progress
- **Health Activities**: Track self-care and healthy habits
- **Achievements**: Earn badges for accomplishing various goals

## Recent Updates

The latest updates include:

- **Improved Responsiveness**: Enhanced mobile and tablet layouts for all components
- **Fixed Streak Logic**: Better handling of daily streak calculations
- **GitHub Pages Support**: Added configuration for easy deployment
- **SEO Enhancements**: Added proper metadata and Open Graph tags
- **UI Polishing**: Refined UI elements for better ADHD-friendly experience

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/my-rpg-quest-log.git
   cd my-rpg-quest-log
   ```

2. Install dependencies:

   ```bash
   npm install
   # or with yarn
   yarn
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

4. Start the AI companion server (optional):

   ```bash
   # In a separate terminal
   cd server
   npm install
   npm start
   # or use the start-server.bat file
   ```

### Running the Application

#### Development Mode

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:

   ```bash
   http://localhost:5173
   ```

#### Production Mode

1. Build the application:

   ```bash
   npm run build
   ```

2. Serve the production build:

   ```bash
   npm run preview
   ```

3. Open your browser and navigate to the provided URL.

#### Static Hosting

If you prefer to serve the application as a static site:

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` folder to your preferred hosting provider.

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages. Follow these steps:

### Method 1: Using GitHub Actions (Automated)

1. Create a GitHub repository named `my-rpg-quest-log` if you haven't already.
2. Push your code to the main/master branch of your GitHub repository:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/my-rpg-quest-log.git
   git push -u origin main
   ```

3. Go to your repository settings on GitHub:
   - Navigate to "Settings" > "Pages"
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy your site.

4. Your site will be available at `https://yourusername.github.io/my-rpg-quest-log/`.

### Method 2: Manual Deployment

1. Create a GitHub repository named `my-rpg-quest-log` if you haven't already.
2. Install the gh-pages package (already included in devDependencies):

   ```bash
   npm install
   ```

3. Run the deployment command:

   ```bash
   npm run deploy
   ```

4. If this is your first deployment, you may need to configure git user details:

   ```bash
   git config user.email "your-email@example.com"
   git config user.name "Your Name"
   ```

5. Your site will be deployed to the gh-pages branch of your repository.
6. Go to your repository settings on GitHub:
   - Navigate to "Settings" > "Pages"
   - Under "Source", select "Deploy from a branch".
   - Select "gh-pages" branch and "/ (root)" folder.
   - Click "Save".

7. Your site will be available at `https://yourusername.github.io/my-rpg-quest-log/`.

## Local Development

For local development, run:

```bash
npm run dev
```

The site will be available at `http://localhost:5173/`.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Google Gemini API (for AI companion)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
