import { test, expect } from '@playwright/test';
import path from 'path';

const pages = [
  { name: 'home', url: 'index.html', title: 'الخطيب لوجستيك | الرئيسية' },
  { name: 'product_details', url: 'product-details.html', title: 'حفار هيدروليكي 320 GC' },
  { name: 'admin', url: 'admin.html', title: 'لوحة التحكم | الخطيب لوجستيك' },
  { name: 'add_product', url: 'add-product.html', title: 'إضافة منتج جديد | الخطيب لوجستيك' }
];

test.describe('Website Integration & Theme Verification', () => {
  for (const pageInfo of pages) {
    test(`verify ${pageInfo.name} page`, async ({ page }) => {
      const filePath = `file://${path.resolve(pageInfo.url)}`;
      await page.goto(filePath);

      // Verify Title
      await expect(page).toHaveTitle(new RegExp(pageInfo.title));

      // Verify Theme Consistency (Al-Khatib Logistics)
      const bodyText = await page.innerText('body');
      expect(bodyText).toContain('الخطيب لوجستيك');

      // Verify Local Image Assets
      const images = await page.locator('img');
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        const src = await images.nth(i).getAttribute('src');
        // Ensure no external URLs
        expect(src).not.toMatch(/^http/);
        expect(src).toMatch(/^img\//);
      }

      // Capture screenshot
      await page.screenshot({ path: `verification/screenshots/${pageInfo.name}_final.png`, fullPage: true });
    });
  }

  test('verify navigation interconnectivity', async ({ page }) => {
    await page.goto(`file://${path.resolve('index.html')}`);

    // Check link to products
    await page.click('a[href="product-details.html"]');
    await expect(page).toHaveURL(/product-details.html/);

    // Check link to admin
    await page.goto(`file://${path.resolve('index.html')}`);
    await page.click('a[href="admin.html"]');
    await expect(page).toHaveURL(/admin.html/);

    // Check link to add-product from admin
    await page.click('a[href="add-product.html"]');
    await expect(page).toHaveURL(/add-product.html/);
  });
});
