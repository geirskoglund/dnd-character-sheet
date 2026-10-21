import {test,expect} from '@playwright/test';
import {createCharacter,fillField,finish,menuAction,wheelEntry} from './helpers';

test('HP correction ignores temporary HP in both directions, clamps to HP limits and supports cancel and undo',async({page})=>{
 await createCharacter(page);await page.getByRole('button',{name:'Combat',exact:true}).click();
 await page.locator('[data-action="hp"]').click();await wheelEntry(page,'Endring','-5');await finish(page);
 await page.locator('[data-action="temp-hp"]').click();await fillField(page,'Temporary HP','3');await finish(page);
 const d=page.locator('.number-change-dialog');
 await page.locator('[data-action="hp"]').click();await wheelEntry(page,'Endring','-5');
 await expect(d.locator('.number-after b')).toHaveText('2');
 await page.screenshot({path:test.info().outputPath('hp-correction-390.png')});
 await d.getByRole('button',{name:'Avbryt',exact:true}).click();
 await expect(page.locator('[data-action="hp"]')).toContainText('7 / 12');
 await page.locator('[data-action="hp"]').click();await wheelEntry(page,'Endring','-5');await finish(page);
 await expect(page.locator('[data-action="hp"]')).toContainText('2 / 12');await expect(page.locator('[data-action="temp-hp"]')).toContainText('3');
 await menuAction(page,'Angre siste endring');await expect(page.locator('[data-action="hp"]')).toContainText('7 / 12');await expect(page.locator('[data-action="temp-hp"]')).toContainText('3');
 await page.locator('[data-action="hp"]').click();await wheelEntry(page,'Endring','-100');await finish(page);
 await expect(page.locator('[data-action="hp"]')).toContainText('0 / 12');await expect(page.locator('[data-action="temp-hp"]')).toContainText('3');
 await page.locator('[data-action="hp"]').click();await wheelEntry(page,'Endring','100');await finish(page);
 await expect(page.locator('[data-action="hp"]')).toContainText('12 / 12');await expect(page.locator('[data-action="temp-hp"]')).toContainText('3');
 await page.reload();await page.getByRole('button',{name:'Combat',exact:true}).click();await expect(page.locator('[data-action="hp"]')).toContainText('12 / 12');await expect(page.locator('[data-action="temp-hp"]')).toContainText('3');
});

test('manual entry shows a visual zero only when empty; retains the wheel choice and new digits replace it',async({page})=>{
 await createCharacter(page);await page.locator('[data-action="money"]').click();
 const d=page.locator('.number-change-dialog');await wheelEntry(page,'GP','6');
 await d.getByRole('button',{name:'Skriv inn GP',exact:true}).click();
 const value=d.getByRole('textbox',{name:'GP',exact:true});
 await expect(value).toHaveText('');expect(await value.evaluate(el=>getComputedStyle(el,'::before').content)).toBe('"0"');expect(await value.evaluate(el=>el.tagName)).toBe('DIV');
 await expect(d.locator('input,textarea,[contenteditable="true"]')).toHaveCount(0);
 await expect(d.locator('.number-after b')).toHaveText('6,00');
 await d.getByRole('button',{name:'Tilbake til hjul',exact:true}).click();
 await expect(d.getByRole('spinbutton',{name:'Tallhjul: GP',exact:true})).toHaveAttribute('aria-valuenow','6');
 await d.getByRole('button',{name:'Skriv inn GP',exact:true}).click();
 await d.locator('[data-key="2"]').click();await expect(value).toHaveText('2');expect(await value.evaluate(el=>getComputedStyle(el,'::before').content)).not.toBe('"0"');await expect(d.locator('.number-after b')).toHaveText('2,00');
 await page.screenshot({path:test.info().outputPath('typed-keypad-390.png')});
 await d.locator('[data-key="⌫"]').click();await expect(value).toHaveText('');expect(await value.evaluate(el=>getComputedStyle(el,'::before').content)).toBe('"0"');await expect(d.locator('.number-after b')).toHaveText('6,00');
 await value.dispatchEvent('pointerdown',{pointerType:'touch'});expect(await value.evaluate(el=>getComputedStyle(el).userSelect)).toBe('none');
 await page.screenshot({path:test.info().outputPath('blank-keypad-390.png')});
 await finish(page);await page.locator('[data-action="money"]').click();await expect(d.locator('.number-before b')).toHaveText('6,00');
});
