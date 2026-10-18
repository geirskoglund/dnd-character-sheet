import type { Page } from '@playwright/test';
export async function openMenu(page: Page) {
  const menu = page.locator('details.app-menu');
  if (await menu.getAttribute('open') === null) await menu.locator('summary').click();
}
export async function menuAction(page: Page, name: string) {
  await openMenu(page);
  await page.getByRole('button', {name, exact:true}).click();
}
