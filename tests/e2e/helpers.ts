import {expect,type Page,type Locator} from '@playwright/test';
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
  await page.getByRole('dialog').getByRole('button',{name:'Rediger gjenstanden',exact:true}).click();
}

/** Navigate through the actual questions; hidden source controls are only read to identify choices. */
export async function revealField(page:Page,name:string,index=0){
 const d=page.getByRole('dialog');if(await d.isVisible()&&await d.getAttribute('data-equipment-editor'))return equipmentField(page,name);if(name==='GP'&&await d.locator('#money-exact').isVisible())await d.locator('#money-exact').click();if(!await d.isVisible())return page.getByRole('combobox',{name,exact:true}).nth(index);
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
export async function typeWheelText(page:Page,name:string,value:string){
 const label=name==='Hele GP'?'GP':name==='Hundredeler'?'CP':name;
 const input=page.locator('dialog.number-change-dialog').getByRole('textbox',{name:label,exact:true});
 await input.press('ControlOrMeta+A');
 if(value)await input.pressSequentially(value);else await input.press('Backspace');
}
export async function wheelEntry(page:Page,name:string,value:string){
 const label=name==='Hele GP'?'GP':name==='Hundredeler'?'CP':name;
 const d=page.locator('dialog.number-change-dialog'),input=d.getByRole('textbox',{name:label,exact:true});
 if(!await input.isVisible()){
  if(await d.locator('.number-entry-panel').isVisible())await d.locator('.number-entry-tabs').getByRole('button',{name:label,exact:true}).click();
  else await d.getByRole('button',{name:`Skriv inn ${label}`,exact:true}).click();
 }
 await typeWheelText(page,label,value);await d.getByRole('heading').click();
}
export async function setNumberField(page:Page,field:Locator,value:string){
 if(value==='')throw new Error('WP04: tall-elementer har ingen Fjern verdi-kontroll.');
 const original=Number(await field.inputValue())||0;
 await field.click();await wheelEntry(page,'Endring',String(Number(value)-original));
 await page.locator('dialog.number-change-dialog').getByRole('button',{name:'OK',exact:true}).click();
 await expect(page.locator('dialog.number-change-dialog')).toHaveCount(0);
}
export async function fillField(page:Page,name:string,value:string,index=0){
 const change=page.locator('dialog.number-change-dialog');
 if(await change.count()){
  if(name==='HP-endring i tall'||name==='Temporary HP'){await wheelEntry(page,'Endring',value);return;}
  if(name==='GP'){
   const before=await change.locator('.number-before b').innerText();const original=Math.round(Number(before.replace('−','-').replace(',','.'))*100);
   const diff=Math.round(Number(value)*100)-original;
   await wheelEntry(page,'Hele GP',String(Math.trunc(diff/100)));await wheelEntry(page,'Hundredeler',String(diff%100));return;
  }
 }
 const field=await revealField(page,name,index);
 if(await field.getAttribute('data-wheel-bound'))await setNumberField(page,field,value);else if(await field.getAttribute('data-text-bound')){await field.click();const editor=page.locator('dialog.text-editor');await editor.locator('input,textarea').fill(value);await editor.getByRole('button',{name:'OK',exact:true}).click();await expect(editor).toHaveCount(0);}else await field.fill(value);
}
export async function characterStep(page:Page,index:number){await revealField(page,['Navn','Klasse','STR'][index]);}
export async function finish(page:Page){
 const d=page.getByRole('dialog');
 if(await d.getAttribute('class')==='number-change-dialog'){await d.getByRole('button',{name:'OK',exact:true}).click();await expect(d).not.toBeVisible();return;}
 await expect(d.locator('form')).not.toHaveAttribute('aria-busy','true');
 if(await d.getAttribute('data-equipment-editor')){if(await page.locator('dialog #wizard-question').textContent()!=='Vil du ta gjenstanden i bruk?')await d.getByRole('button',{name:/^Lagre(?: merknad| antall)?$/,exact:true}).click();if(await d.isVisible()&&await page.locator('dialog #wizard-question').textContent()==='Vil du ta gjenstanden i bruk?')await d.getByRole('button',{name:'Ikke i bruk',exact:true}).or(d.getByRole('button',{name:'Nei',exact:true})).click();return;}
 if(await d.getAttribute('data-kind')==='view'){await d.getByRole('button',{name:'Lukk',exact:true}).click();return;}
 for(let n=0;await d.getAttribute('data-wizard')!==null;n++){
  const submit=d.locator('#submit');if(await submit.isVisible()&&await submit.textContent()!=='Neste')break;
  if(n>65)throw new Error('Veiviseren kunne ikke fullføres.');await nextQuestion(page);
 }
 await d.locator('#submit').click();
}
export async function useEquipment(page:Page,name:string){
 await equipmentTab(page);
 await page.getByRole('button',{name:`${name} · eid`,exact:true}).click();
 const d=page.getByRole('dialog');if(await d.getByRole('group',{name:'Håndbruk',exact:true}).count()){const used=await page.locator('[data-item] .state-mark').allTextContents();const hand=await d.getByRole('button',{name:'Begge hender',exact:true}).count()&&!await d.getByRole('button',{name:'Høyre hånd',exact:true}).count()?'Begge hender':used.includes('Høyre hånd')?'Venstre hånd':'Høyre hånd';await d.getByRole('button',{name:hand,exact:true}).click();if(await d.getByRole('button',{name:'Behold oppsett',exact:true}).isVisible())await d.getByRole('button',{name:'Behold oppsett',exact:true}).click();else{await expect(d.locator('form')).not.toHaveAttribute('aria-busy','true');await expect(d.getByRole('button',{name:hand,exact:true})).toHaveAttribute('aria-pressed','true');await finish(page);}}else{await d.getByRole('checkbox',{name:'I bruk',exact:true}).check();await expect(d.locator('form')).not.toHaveAttribute('aria-busy','true');await expect(d.getByRole('checkbox',{name:'I bruk',exact:true})).toBeChecked();await finish(page);}
 await page.getByRole('dialog').waitFor({state:'hidden'});
}
export async function advancedRecord(page:Page){
 await page.getByRole('button',{name:'Tilpass',exact:true}).click();
 await page.getByRole('button',{name:'Flere detaljer',exact:true}).click();
}

export async function closeEditor(page:Page){const d=page.getByRole('dialog').last(),confirmation=await d.getAttribute('data-kind')==='confirm';const close=d.getByRole('button',{name:'Lukk veiviseren',exact:true});if(await close.isVisible())await close.click();else await d.getByRole('button',{name:'Avbryt',exact:true}).or(d.getByRole('button',{name:'Lukk',exact:true})).click();if(!confirmation)await d.waitFor({state:'hidden'});}

/** Equipment helpers follow the public guided questions; no hidden controls or direct writes. */
export async function equipmentOverview(page:Page){const d=page.getByRole('dialog');for(let n=0;n<20;n++){const title=await page.locator('dialog #wizard-question').textContent();if(title==='Hva gjør gjenstanden?')return;if(title?.startsWith('Hva heter')){await d.getByRole('button',{name:'Neste',exact:true}).click();continue;}await d.getByRole('button',{name:'Tilbake',exact:true}).click();}throw Error('Fant ikke virkningsoversikten');}
export async function addItemBonus(page:Page,label:string,value:string){const d=page.getByRole('dialog');await equipmentOverview(page);await d.getByRole('button',{name:'+ Legg til virkning',exact:true}).click();await d.getByRole('button',{name:label,exact:true}).click();await setNumberField(page,d.getByRole('spinbutton',{name:label==='Skadebonus'?'Skadebonus':'Verdi',exact:true}),value);await d.getByRole('button',{name:'Neste',exact:true}).click();await d.getByRole('button',{name:'Nei',exact:true}).click();}
async function equipmentField(page:Page,name:string){const d=page.getByRole('dialog'),field=()=>d.getByLabel(name,{exact:true});if(await field().isVisible())return field();await equipmentOverview(page);
 if(['Angrepsbonus','AC-bonus','Skadebonus'].includes(name)){await d.getByRole('button',{name:'+ Legg til virkning',exact:true}).click();await d.getByRole('button',{name:name==='AC-bonus'?'AC':name,exact:true}).click();return d.getByRole('spinbutton',{name:name==='Skadebonus'?name:'Verdi',exact:true});}
 if(name==='Antall'){await d.getByRole('button',{name:'Antall',exact:true}).click();return field();}
 await d.getByRole('button',{name:'Merknad og attunement',exact:true}).click();if(name==='Utstyrsnotat'){await d.getByRole('button',{name:'Merknad',exact:true}).click();return d.getByRole('textbox',{name:'Merknad',exact:true});}
 if(['Attack (manuell total)','Damage (manuell total)'].includes(name)){await d.getByRole('button',{name:'Manuelle totaler (DM)',exact:true}).click();await d.getByRole('button',{name,exact:true}).click();return field();}
 throw Error('Ukjent utstyrsspørsmål: '+name);
}
