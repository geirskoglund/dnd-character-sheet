import {characterStep,finish} from './helpers';
import { menuAction } from './helpers';
import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

test('updates a cached release explicitly, protects editing tabs, and preserves data offline', async ({ page, context }) => {
  const originalIndex = await readFile('dist/index.html', 'utf8');
  const originalWorker = await readFile('dist/sw.js', 'utf8');
  let release = 'A', failWorker = false;
  const server = createServer(async (req, res) => {
    const path = new URL(req.url!, 'http://localhost').pathname;
    if (!path.startsWith('/dnd-character-sheet/') || path.includes('..')) { res.writeHead(404).end(); return; }
    const relative = path.slice('/dnd-character-sheet/'.length) || 'index.html';
    const html = originalIndex.replace(/<title>.*?<\/title>/, `<title>Release ${release}</title>`);
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (relative === 'index.html') { res.setHeader('Content-Type', 'text/html'); res.end(html); }
      else if (relative === 'sw.js') {
        if (failWorker) { res.writeHead(503).end(); return; }
        const revision = createHash('sha256').update(html).digest('hex');
        const worker = originalWorker.replace(/(url:"index\.html",revision:")[^"]+("})/, `$1${revision}$2`);
        expect(worker).not.toBe(originalWorker);
        res.setHeader('Content-Type', 'text/javascript'); res.end(worker);
      } else {
        const mime = relative.endsWith('.js') ? 'text/javascript' : relative.endsWith('.css') ? 'text/css' : relative.endsWith('.svg') ? 'image/svg+xml' : 'text/plain';
        res.setHeader('Content-Type', mime); res.end(await readFile(resolve('dist', relative)));
      }
    } catch { res.writeHead(404).end(); }
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address() as { port: number };
  const url = `http://127.0.0.1:${address.port}/dnd-character-sheet/`;
  try {
    await page.goto(url); await expect(page).toHaveTitle('Release A');
    await menuAction(page, 'Ny karakter');
    await page.getByRole('textbox', { name: 'Navn', exact: true }).fill('Alva');
    await page.getByRole('combobox', { name: 'Art / species', exact: true }).selectOption({ label: 'Human' });
    await characterStep(page,1);
    await page.getByRole('combobox', { name: 'Klasse', exact: true }).selectOption({ label: 'Fighter' });
    await characterStep(page,2);
    await page.getByRole('spinbutton', { name: 'Maks HP fra karakterarket', exact: true }).fill('12');
    await finish(page);
    await expect(page.getByRole('heading', { name: 'Alva', exact: true })).toBeVisible();
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await page.evaluate(() => localStorage.setItem('update-sentinel', 'behold'));

    const other = await context.newPage(); await other.goto(url);
    await menuAction(other, 'Rediger karakter');
    await other.getByRole('textbox', { name: 'Navn', exact: true }).fill('Bevart etter oppdatering');
    await page.clock.install();release = 'B';
    await page.clock.fastForward(60_000);
    await expect(page.locator('#app-update')).toContainText('En ny versjon er klar');
    await page.getByLabel('Appoppdatering').getByRole('button',{name:'Lukk',exact:true}).click();
    await page.clock.fastForward(60_000);await expect(page.locator('#app-update')).not.toBeVisible();
    await menuAction(page, 'Se etter oppdatering');
    await expect(page.locator('#app-update')).toContainText('En ny versjon er klar');
    await expect(page).toHaveTitle('Release A');
    await expect(other.getByRole('textbox', { name: 'Navn', exact: true })).toHaveValue('Bevart etter oppdatering');
    await page.getByRole('button', { name: 'Oppdater appen', exact: true }).click();
    await expect(page.locator('#app-update')).toContainText('flere faner');
    await expect(other.getByRole('dialog')).toBeVisible();
    await finish(other);
    await expect(other.getByRole('heading', { name: 'Bevart etter oppdatering', exact: true })).toBeVisible();
    await other.close();
    await page.getByRole('button', { name: 'Oppdater appen', exact: true }).click();
    await expect(page).toHaveTitle('Release B');
    await expect(page.getByRole('heading', { name: 'Bevart etter oppdatering', exact: true })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('update-sentinel'))).toBe('behold');
    await expect(page.getByLabel('Karakterstatus')).toContainText('12 / 12');

    await context.setOffline(true); await page.reload();
    await expect(page).toHaveTitle('Release B');
    await expect(page.getByRole('heading', { name: 'Bevart etter oppdatering', exact: true })).toBeVisible();
    await menuAction(page, 'Se etter oppdatering');
    await expect(page.locator('#app-update')).toContainText('uten nett');
    await page.getByLabel('Appoppdatering').getByRole('button', {name:'Lukk',exact:true}).click();
    failWorker = true;
    await context.setOffline(false);
    await menuAction(page, 'Se etter oppdatering');
    await expect(page.locator('#app-update')).toContainText('Kunne ikke sjekke');
    await expect(page.getByRole('heading', { name: 'Bevart etter oppdatering', exact: true })).toBeVisible();
  } finally {
    await context.setOffline(false);
    await page.close();
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
