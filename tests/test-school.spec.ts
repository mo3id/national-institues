import { test, expect } from '@playwright/test';

test.describe('School Dashboard Management', () => {
    // Assuming the app runs on localhost:3000
    const baseURL = 'http://localhost:3000';

    test('should validate and create a school correctly', async ({ page }) => {
        // 1. Go to dashboard
        await page.goto(`${baseURL}/dash`);

        // (If it requires login, we assume auth passes or we intercept if needed)
        // Wait for the dashboard to load (look for "Schools" tab)
        const schoolsTab = page.locator('button:has-text("Schools"), div:has-text("المدارس")').first();
        await schoolsTab.click();

        // 2. Click "Add School"
        const addSchoolBtn = page.locator('button:has-text("Add School"), button:has-text("إضافة مدرسة")');
        await addSchoolBtn.click();

        // Wait for modal
        const modal = page.locator('.dash-modal-content');
        await expect(modal).toBeVisible();

        // 3. Form Validation Test
        // Enter invalid Negative values
        await page.fill('input[placeholder="e.g. 4.9"]', '-1');
        await page.fill('input[placeholder="e.g. 2500"], input[placeholder="e.g. +2.5k"]', '-5');
        await page.fill('input[placeholder="e.g. 1995"]', '1800'); // Invalid year (outside 1900-current range)

        // Click "Save" to trigger validation
        const saveBtn = page.locator('button:has-text("Save"), button:has-text("حفظ")');
        await saveBtn.click();

        // Expecting validation error texts to show up
        await expect(page.locator('span.text-red-500').first()).toBeVisible();

        // 4. Fill with Correct Values
        await page.fill('input[placeholder="e.g. 4.9"]', '4.5'); // rating
        await page.fill('input[placeholder="e.g. 2500"], input[placeholder="e.g. +2.5k"]', '1500'); // student count
        await page.fill('input[placeholder="e.g. 1995"]', '2010'); // foundation year

        // Fill other required fields
        const nameInputEN = modal.locator('label:has-text("School Name (EN)"), label:has-text("اسم المدرسة (إنجليزي)")').locator('..').locator('input');
        await nameInputEN.fill('E2E Test School');

        const nameInputAR = modal.locator('label:has-text("School Name (AR)"), label:has-text("اسم المدرسة (عربي)")').locator('..').locator('input');
        await nameInputAR.fill('مدرسة E2E اختبار');

        const locInputEN = modal.locator('label:has-text("Location (EN)"), label:has-text("الموقع (إنجليزي)")').locator('..').locator('input');
        await locInputEN.fill('Test Location');

        const locInputAR = modal.locator('label:has-text("Location (AR)"), label:has-text("الموقع (عربي)")').locator('..').locator('input');
        await locInputAR.fill('موقع الاختبار');

        const principalEN = modal.locator('label:has-text("Principal (EN)"), label:has-text("مدير المدرسة (إنجليزي)")').locator('..').locator('input');
        await principalEN.fill('Mr. E2E Admin');

        // Click Save Valid Form
        await saveBtn.click();

        // The modal should close and the school should be added.
        await expect(modal).not.toBeVisible({ timeout: 10000 });

        // 5. Verify the newly created school on the website frontend
        await page.goto(`${baseURL}/schools`);
        await page.waitForLoadState('networkidle');

        // Make sure our "E2E Test School" is visible on the board!
        await expect(page.locator('text=E2E Test School').first()).toBeVisible();
        await expect(page.locator('text=4.5').first()).toBeVisible(); // The rating
    });
});
