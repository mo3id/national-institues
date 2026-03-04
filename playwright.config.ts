// playwright.config.ts
// Place this in the project root: /Users/mohamedeidali/Desktop/national-institues/

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,           // Run sequentially to avoid race conditions on shared DB
    retries: 1,                     // 1 retry on CI
    timeout: 30_000,
    reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],

    use: {
        baseURL: 'http://localhost:3000',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 10_000,
    },

    projects: [
        {
            name: 'chromium-ltr',
            use: {
                ...devices['Desktop Chrome'],
                locale: 'en-US',
            },
        },
        {
            name: 'chromium-rtl',
            use: {
                ...devices['Desktop Chrome'],
                locale: 'ar-EG',
            },
        },
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
    ],

    // Start dev server automatically before running tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 60_000,
    },
});
