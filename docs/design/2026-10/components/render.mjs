import {chromium} from 'playwright';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import assert from 'node:assert/strict';

const folder=dirname(fileURLToPath(import.meta.url));
const base=process.env.STUDY_URL||'http://127.0.0.1:4190/components/';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true});
const page=await browser.newPage({viewport:{width:1160,height:1000},deviceScaleFactor:1.5});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const reports=[];
try {
 for(const [board,file] of [['families','5-elementfamilier'],['alternatives','6-alternativer'],['states','7-tilstander']]){
  await page.goto(`${base}?board=${board}`);
  await page.evaluate(()=>document.fonts.ready);
  assert(await page.evaluate(()=>document.fonts.check('16px Journal')&&document.fonts.check('16px Source')),'Local fonts loaded');
  const report=await page.evaluate(()=>{
   const equalPills=[...document.querySelectorAll('.pills')].map(p=>[...p.children].map(c=>({width:c.getBoundingClientRect().width,height:c.getBoundingClientRect().height})));
   const clipping=[...document.querySelectorAll('.pill,.modifier,.stat')].filter(e=>e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1).map(e=>e.textContent);
   return {board:document.querySelector('.sheet').dataset.board,equalPills,clipping};
  });
  for(const group of report.equalPills){
   assert(Math.max(...group.map(p=>p.width))-Math.min(...group.map(p=>p.width))<1,`${board}: equal pill widths`);
   assert(Math.max(...group.map(p=>p.height))-Math.min(...group.map(p=>p.height))<1,`${board}: equal pill heights including +`);
  }
  assert.deepEqual(report.clipping,[],`${board}: no clipped values`);
  if(board==='families'){
   assert.equal(await page.locator('.stats>.stat').count(),5);
   assert.equal(await page.locator('.modifier').count(),4);
   assert.equal(await page.locator('.coin').count(),6);
   const arcs=await page.locator('.coin defs path').evaluateAll(els=>els.map(e=>e.getAttribute('d')));
   assert.equal(new Set(arcs).size,1,'All abbreviations follow the same arc');
   const labels=await page.locator('.coin textPath').evaluateAll(els=>els.map(e=>[e.getAttribute('startOffset'),e.getAttribute('textLength')]));
   assert(labels.every(([offset,length])=>offset==='50%'&&length==='27'),'Uniform arc label placement and length');
   assert.equal(await page.locator('.hp-meter').count(),0);
  }
  if(board==='alternatives'){
   const sameContents=await page.locator('.alt-column').evaluateAll(cols=>cols.map(c=>[...c.querySelectorAll('.pill')].map(p=>p.textContent.trim())));
   assert.deepEqual(sameContents[0],sameContents[1],'Icon comparison uses identical text and values');
   const modifiers=await page.locator('.mod-option').evaluateAll(cols=>cols.map(c=>[...c.querySelectorAll('.modifier')].map(p=>p.textContent.trim())));
   assert.deepEqual(modifiers[0],modifiers[1],'Modifier comparison uses identical text and values');
  }
  await page.locator('.sheet').screenshot({path:resolve(folder,'..',`${file}.png`)});
  reports.push(report);
 }
 const mobile=[];
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});
  for(const family of ['identity','status','modifiers','abilities','species','features','feats','cantrips','spells','weapons','armor','equipment','languages','notes','resources','icons']){
   await page.goto(`${base}?board=${family==='icons'?'alternatives':'families'}&solo=${family}`);
   await page.evaluate(()=>document.fonts.ready);
   const result=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth>innerWidth,
    clipping:[...document.querySelectorAll('.pill,.modifier,.stat')].filter(e=>e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1).map(e=>e.textContent),
    pillBoxes:[...document.querySelectorAll('.pills')].map(p=>[...p.children].map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))),
   }));
   assert.equal(result.overflow,false,`${width}px ${family}: horizontal overflow`);
   assert.deepEqual(result.clipping,[],`${width}px ${family}: clipped card text`);
   for(const group of result.pillBoxes){
    assert(Math.max(...group.map(p=>p.w))-Math.min(...group.map(p=>p.w))<1,`${width}px ${family}: equal widths per collection`);
    assert(Math.max(...group.map(p=>p.h))-Math.min(...group.map(p=>p.h))<1,`${width}px ${family}: equal heights per collection`);
   }
   mobile.push({width,family,...result});
  }
 }
 assert.deepEqual(errors,[],'No page or resource errors');
 console.log(JSON.stringify({reports,mobile,errors},null,2));
} finally {await browser.close();}
