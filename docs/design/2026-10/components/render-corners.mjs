import {chromium} from 'playwright';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});
const base=process.env.STUDY_URL||'http://127.0.0.1:4190/components/';
const page=await browser.newPage({viewport:{width:1160,height:1000},deviceScaleFactor:1.5});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
try{
 await page.goto(`${base}?board=corners`);await page.evaluate(()=>document.fonts.ready);
 assert(await page.evaluate(()=>document.fonts.check('16px Journal')&&document.fonts.check('16px Source')));
 const report=await page.evaluate(()=>({
  buttons:document.querySelectorAll('.corner-trial button').length,
  markers:document.querySelectorAll('.corner-mark').length,
  markerSizes:[...document.querySelectorAll('.corner-mark')].map(e=>[e.clientWidth,e.clientHeight]),
  status:[...document.querySelectorAll('.stats>.stat')].map(e=>({label:e.querySelector('small').textContent,bg:getComputedStyle(e).backgroundColor,border:getComputedStyle(e).borderColor,marked:!!e.querySelector('.corner-mark')})),
  coins:document.querySelectorAll('.coin .corner-mark').length,
 }));
 assert.equal(report.buttons,report.markers);
 assert(report.markerSizes.every(([w,h])=>w===10&&h===10));
 assert.equal(report.coins,0);
 assert.equal(new Set(report.status.map(s=>s.bg)).size,1,'Status surfaces match');
 assert.equal(new Set(report.status.map(s=>s.border)).size,1,'Status borders match');
 assert.deepEqual(report.status.filter(s=>s.marked).map(s=>s.label),['GP']);
 await page.locator('.sheet').screenshot({path:resolve(dirname(fileURLToPath(import.meta.url)),'..','8-hjornemarkor.png')});
 const mobile=[];
 for(const width of [320,390])for(const sample of ['status','modifiers','species','weapons','readonly','spells','resources','long','navigation','actions']){
  await page.setViewportSize({width,height:844});
  await page.goto(`${base}?board=corners&solo=${sample}`);await page.evaluate(()=>document.fonts.ready);
  const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,
   clipping:[...document.querySelectorAll('.pill,.modifier,.stat')].filter(e=>e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1).map(e=>e.textContent),
   uniform:[...document.querySelectorAll('.pills')].every(p=>{const boxes=[...p.children].map(e=>e.getBoundingClientRect());return Math.max(...boxes.map(b=>b.width))-Math.min(...boxes.map(b=>b.width))<1&&Math.max(...boxes.map(b=>b.height))-Math.min(...boxes.map(b=>b.height))<1;}),
  }));
  assert.equal(result.overflow,false,`${width}px ${sample}: overflow`);assert.deepEqual(result.clipping,[]);assert(result.uniform);
  mobile.push({width,sample,...result});
 }
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({report,mobile,errors},null,2));
}finally{await browser.close();}
