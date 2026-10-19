import {chromium} from 'playwright';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const folder=dirname(fileURLToPath(import.meta.url));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH ?? '/usr/bin/chromium',headless:true});
const page=await browser.newPage({viewport:{width:1500,height:1700},deviceScaleFactor:1.5});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
const summaries=[];
for(const [theme,file] of [['forge','1-runesmed'],['journal','2-eventyrjournal'],['stars','3-stjernekart']]){
 await page.goto(`http://127.0.0.1:4190/?theme=${theme}`);await page.evaluate(()=>document.fonts.ready);
 await page.locator('.board').screenshot({path:resolve(folder,file+'.png')});
 const report=await page.evaluate(()=>({theme:document.querySelector('.board').dataset.theme,fonts:['Cinzel','Journal','Marcellus','Source'].map(f=>[f,document.fonts.check(`16px ${f}`)]),stats:[...document.querySelectorAll('[data-screen="character"] .stat')].map(el=>el.textContent.trim()),modifiers:[...document.querySelectorAll('.modifiers>button')].map(el=>el.textContent.trim()),abilities:[...document.querySelectorAll('.abilities>div')].map(el=>el.textContent.trim()),screens:[...document.querySelectorAll('.phone')].map(el=>({type:el.dataset.screen,width:el.clientWidth,scrollWidth:el.scrollWidth,content:[...el.querySelectorAll('.page-content,.dialog-scroll')].map(e=>({height:e.clientHeight,scrollHeight:e.scrollHeight})),pills:[...el.querySelectorAll('.pills')].map(p=>[...p.children].map(c=>({w:c.getBoundingClientRect().width,h:c.getBoundingClientRect().height})))}))}));
 summaries.push(report);
}
for(const [query,selector,file] of [['dialogs','.dialog-comparison','4-dialoger'],['overview','.overview','0-sammenligning']]){await page.goto(`http://127.0.0.1:4190/?${query}=1`);await page.evaluate(()=>document.fonts.ready);await page.locator(selector).screenshot({path:resolve(folder,file+'.png')});}
console.log(JSON.stringify({errors,summaries},null,2));await browser.close();
