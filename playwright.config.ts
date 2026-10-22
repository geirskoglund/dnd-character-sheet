import { defineConfig } from '@playwright/test';
export default defineConfig({
  reporter: process.env.CI ? [['github'], ['line']] : [['list']],
  testDir: './tests/e2e', fullyParallel: true,
  use: { baseURL: 'http://127.0.0.1:4173/dnd-character-sheet/my-dnd/app/', viewport: { width: 390, height: 844 },
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {} },
  webServer: { command: 'npm run preview -- --port 4173 --strictPort --base /dnd-character-sheet/my-dnd/app/',
    url: 'http://127.0.0.1:4173/dnd-character-sheet/my-dnd/app/', reuseExistingServer: !process.env.CI },
});
