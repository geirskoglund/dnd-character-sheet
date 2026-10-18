import { test, expect } from '@playwright/test';

async function create(page: import('@playwright/test').Page, name = 'Alva') {
  await page.getByRole('button', { name: 'Ny karakter', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Navn', exact: true })).toHaveValue('');
  await page.getByRole('textbox', { name: 'Navn', exact: true }).fill(name);
  await page.getByRole('spinbutton', { name: 'Level', exact: true }).fill('5');
  await page.getByRole('button', { name: 'Lagre', exact: true }).click();
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
}
test('mobile character lifecycle, isolated copy, cancellation, notes, undo and persisted selection', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('./'); await create(page);
  await page.getByRole('button', { name: 'Rediger karakter' }).click();
  await page.getByRole('spinbutton', { name: 'GP', exact: true }).fill('12.34');
  await page.getByRole('button', { name: 'Lagre', exact: true }).click();
  await expect(page.getByLabel('Karakterstatus')).toContainText('12.34');
  await page.getByRole('button', { name: 'Legg til notat' }).click();
  await page.getByRole('textbox', { name: 'Tittel' }).fill('Bakgrunn');
  await page.getByRole('textbox', { name: 'Tekst' }).fill('Reisende fra nord.');
  await page.getByRole('button', { name: 'Lagre', exact: true }).click();
  await page.getByText('Karakteradministrasjon', { exact: true }).click();
  await page.getByRole('button', { name: 'Kopier karakter' }).click();
  await expect(page.getByRole('heading', { name: 'Alva (kopi)', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Bakgrunn', exact: true }).click();
  await page.getByRole('textbox', { name: 'Tekst' }).fill('Kopiens historie');
  await page.getByRole('button', { name: 'Lagre', exact: true }).click();
  await page.getByRole('combobox', { name: 'Karakter', exact: true }).selectOption({ label: 'Alva' });
  await page.getByRole('button', { name: 'Bakgrunn', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Tekst' })).toHaveValue('Reisende fra nord.');
  await page.getByRole('button', { name: 'Avbryt' }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Alva', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Rediger karakter' }).click();
  await page.getByRole('textbox', { name: 'Navn', exact: true }).fill('Should not save');
  await page.getByRole('button', { name: 'Avbryt' }).click();
  await expect(page.getByRole('heading', { name: 'Alva', exact: true })).toBeVisible();
  await page.getByText('Karakteradministrasjon', { exact: true }).click();
  await page.getByRole('button', { name: 'Angre siste endring' }).click();
  await expect(page.getByRole('button', { name: 'Bakgrunn', exact: true })).toHaveCount(0);
  await page.getByText('Karakteradministrasjon', { exact: true }).click();
  await page.getByRole('button', { name: 'Slett karakter', exact: true }).click();
  await page.getByRole('button', { name: 'Avbryt' }).click();
  await expect(page.getByRole('heading', { name: 'Alva', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Slett karakter', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Slett karakter', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Alva (kopi)', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test('production PWA works offline on a GitHub Pages subpath and has no horizontal overflow', async ({ page, context }) => {
  await page.goto('./'); await create(page);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Alva', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Combat', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reaction', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reaction', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reaction', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Character', exact: true }).click();
  await page.getByRole('button', { name: 'Rediger karakter' }).click();
  await page.getByRole('textbox', { name: 'Navn', exact: true }).fill('Offline Alva');
  await page.getByRole('button', { name: 'Lagre', exact: true }).click();
  // The heading updates only after the IndexedDB transaction commits and the list refreshes.
  await expect(page.getByRole('heading', { name: 'Offline Alva', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Offline Alva', exact: true })).toBeVisible();
  for (const width of [320, 360, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Rediger karakter' }).click();
    expect(await page.getByRole('dialog').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.getByRole('button', { name: 'Avbryt' }).click();
  }
});
test('UI backup round-trip, ID collision and malformed-file feedback', async ({ page, browser }) => {
  await page.goto('./'); await create(page);
  await page.getByText('Karakteradministrasjon', { exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Eksporter backup' }).click();
  const path = await (await downloadPromise).path();
  const other = await browser.newContext(); const target = await other.newPage();
  await target.goto('./');
  await target.getByText('Karakteradministrasjon', { exact: true }).click();
  await target.getByRole('button', { name: 'Importer backup' }).click();
  await target.getByLabel('JSON-fil').setInputFiles(path!);
  await target.getByRole('button', { name: 'Importer', exact: true }).click();
  await expect(target.getByRole('heading', { name: 'Alva', exact: true })).toBeVisible();
  await target.getByText('Karakteradministrasjon', { exact: true }).click();
  await target.getByRole('button', { name: 'Importer backup' }).click();
  await target.getByLabel('JSON-fil').setInputFiles(path!);
  await target.getByRole('button', { name: 'Importer', exact: true }).click();
  await expect(target.getByRole('alert')).toContainText('samme ID');
  await target.getByLabel('JSON-fil').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"schemaVersion":99}') });
  await target.getByRole('button', { name: 'Importer', exact: true }).click();
  await expect(target.getByRole('alert')).toContainText('skjemaversjon');
  await other.close();
});

test('multiclass validation and separate navigation scroll positions', async ({ page }) => {
  await page.goto('./'); await create(page);
  await page.getByRole('button', { name: 'Rediger karakter' }).click();
  await page.getByRole('button', { name: '+ Klasse', exact: true }).click();
  await page.getByRole('textbox', { name: 'Klasse', exact: true }).fill('Fighter');
  await page.getByRole('spinbutton', { name: 'Klassenivå', exact: true }).fill('3');
  await page.getByRole('button', { name: 'Lagre', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Summen av klassenivå');
  await page.getByRole('button', { name: '+ Klasse', exact: true }).click();
  await page.getByRole('textbox', { name: 'Klasse', exact: true }).nth(1).fill('Wizard');
  await page.getByRole('spinbutton', { name: 'Klassenivå', exact: true }).nth(1).fill('2');
  await page.getByRole('button', { name: 'Lagre', exact: true }).click();
  await expect(page.getByRole('main')).toContainText('Fighter 3 / Wizard 2');
  await page.setViewportSize({ width: 390, height: 500 });
  await page.evaluate(() => window.scrollTo(0, 200));
  const characterScroll = await page.evaluate(() => scrollY);
  await page.getByRole('button', { name: 'Combat', exact: true }).click();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.evaluate(() => window.scrollTo(0, 70));
  const combatScroll = await page.evaluate(() => scrollY);
  await page.getByRole('button', { name: 'Character', exact: true }).click();
  expect(await page.evaluate(() => scrollY)).toBe(characterScroll);
  await page.getByRole('button', { name: 'Combat', exact: true }).click();
  expect(await page.evaluate(() => scrollY)).toBe(combatScroll);
});

test('storage failure does not claim success or discard the edited form', async ({ page }) => {
  await page.goto('./'); await create(page);
  await page.getByRole('button', { name: 'Rediger karakter' }).click();
  await page.getByRole('textbox', { name: 'Navn', exact: true }).fill('Unsaved');
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === 'characters') throw new DOMException('Lagringsplassen er full.', 'QuotaExceededError');
      return original.apply(this, args);
    };
  });
  await page.getByRole('button', { name: 'Lagre', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('full');
  await expect(page.getByRole('textbox', { name: 'Navn', exact: true })).toHaveValue('Unsaved');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Alva', exact: true })).toBeVisible();
});
