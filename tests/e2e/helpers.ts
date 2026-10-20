import {expect,type Page} from '@playwright/test';
export async function openMenu(page: Page) {
  const menu = page.locator('details.app-menu');
  if (await menu.getAttribute('open') === null) await menu.locator('summary').click();
}
export async function menuAction(page: Page, name: string) {
  await openMenu(page);
  await page.getByRole('button', {name, exact:true}).click();
  if(name==='Angre siste endring')await page.waitForFunction(()=>document.querySelector('#app')?.getAttribute('aria-busy')!=='true');
}
export async function createCharacter(page: Page, species = 'Elf') {
  await page.goto('./'); await menuAction(page, 'Ny karakter');
  await fillField(page,'Navn','Alva');
  await choose(page,'Art / species',{label:species});
  await characterStep(page,1);
  await choose(page,'Klasse',{label:'Fighter'});
  await characterStep(page,2);
  await fillField(page,'Maks HP fra karakterarket','12');
  await finish(page);
  await page.getByRole('dialog').waitFor({state:'hidden'});
}

export async function equipmentTab(page: Page) { await page.getByRole('navigation').getByRole('button',{name:'Utstyr',exact:true}).click(); }
export async function expectCharacterStatus(page: Page, text: string) {
  const {expect} = await import('@playwright/test');
  const equipment = await page.locator('[data-page="equipment"]').getAttribute('aria-current');
  if (equipment) await page.getByRole('button',{name:'Character',exact:true}).click();
  await expect(page.getByLabel('Karakterstatus')).toContainText(text);
  if (equipment) await equipmentTab(page);
}
export async function itemDetails(page: Page) {
  await page.getByRole('dialog').getByText('Tilpass gjenstanden',{exact:true}).click();
}

/** Navigate through the actual questions; hidden source controls are only read to identify choices. */
export async function revealField(page:Page,name:string,index=0){
 const d=page.getByRole('dialog');if(name==='GP'&&await d.locator('#money-exact').isVisible())await d.locator('#money-exact').click();if(!await d.isVisible())return page.getByRole('combobox',{name,exact:true}).nth(index);
 if(await d.getAttribute('data-wizard')===null){const roleField=d.getByRole('combobox',{name,exact:true}).or(d.getByRole('textbox',{name,exact:true})).or(d.getByRole('spinbutton',{name,exact:true}));if(await roleField.count())return roleField.nth(index);return d.getByLabel(name,{exact:true}).nth(index);}
 const fields=d.getByLabel(name,{exact:true});
 const visible=fields.filter({visible:true});
 const target=index===0&&await visible.count()?visible.first():fields.nth(index);
 if(name==='GP'&&await d.locator('#money-exact').isVisible())await d.locator('#money-exact').click();
 if(await d.getAttribute('data-wizard')===null)return target;
 for(let n=0;n<65;n++){
  const direction=await target.evaluate(el=>{const q=el.closest<HTMLElement>('[data-wizard-key]');if(!q||q.dataset.wizardActive==='true')return 0;const active=document.querySelector('[data-wizard-active]');return active&&(active.compareDocumentPosition(q)&Node.DOCUMENT_POSITION_FOLLOWING)?1:-1;});
  if(direction===0)return target;
  if(direction<0)await d.getByRole('button',{name:'Tilbake',exact:true}).click();else await nextQuestion(page);
 }
 throw new Error('Kunne ikke nå spørsmålet: '+name);
}
export async function nextQuestion(page:Page){
 const d=page.getByRole('dialog'),next=d.getByRole('button',{name:'Neste',exact:true});
 if(await next.isVisible()){await next.click();return;}
 const selected=d.locator('[data-wizard-active] [data-wizard-choice][aria-pressed="true"]').first();
 if(await selected.isVisible()){await selected.click();return;}
 throw new Error('Et svar må velges før veiviseren kan gå videre.');
}
export async function choose(page:Page,name:string,option:string|{label:string}|{value:string},index=0){
 const field=await revealField(page,name,index);
 if(await field.isVisible())return field.selectOption(option);
 const label=await field.evaluate((el,arg)=>{const s=el as HTMLSelectElement;return [...s.options].find(o=>typeof arg==='string'?o.value===arg:'label'in arg?o.label===arg.label:o.value===arg.value)?.label;},option);
 if(label===undefined)throw new Error('Fant ikke valget i '+name);
 await page.getByRole('dialog').locator('[data-wizard-active]').getByRole('button',{name:label,exact:true}).click();
}
export async function fillField(page:Page,name:string,value:string,index=0){const field=await revealField(page,name,index);await field.fill(value);}
export async function characterStep(page:Page,index:number){await revealField(page,['Navn','Klasse','STR'][index]);}
export async function finish(page:Page){
 const d=page.getByRole('dialog');
 await expect(d.locator('form')).not.toHaveAttribute('aria-busy','true');
 for(let n=0;await d.getAttribute('data-wizard')!==null;n++){
  const submit=d.locator('#submit');if(await submit.isVisible()&&await submit.textContent()!=='Neste')break;
  if(n>65)throw new Error('Veiviseren kunne ikke fullføres.');await nextQuestion(page);
 }
 await d.locator('#submit').click();
}
export async function useEquipment(page:Page,name:string){
 await equipmentTab(page);
 await page.getByRole('button',{name:`${name} · eid`,exact:true}).click();
 await page.getByRole('checkbox',{name:'I bruk',exact:true}).check();await finish(page);
 await page.getByRole('dialog').waitFor({state:'hidden'});
}
export async function advancedRecord(page:Page){
 await page.getByRole('button',{name:'Tilpass',exact:true}).click();
 await page.getByRole('button',{name:'Flere detaljer',exact:true}).click();
}

export async function closeEditor(page:Page){const d=page.getByRole('dialog'),confirmation=await d.getAttribute('data-kind')==='confirm';const close=d.getByRole('button',{name:'Lukk veiviseren',exact:true});if(await close.isVisible())await close.click();else await d.getByRole('button',{name:'Avbryt',exact:true}).click();if(!confirmation)await d.waitFor({state:'hidden'});}
