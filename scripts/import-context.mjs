// Optional, reproducible SRD 5.1 metadata import. No runtime network access.
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
const revision='a6212beb4b278917c2cff41c2b04c4ef4f3e0d6f';
const read=name=>JSON.parse(process.argv.includes('--cached')?readFileSync(`/tmp/companion-${name}.json`,'utf8'):execFileSync('gh',['api',`repos/5e-bits/5e-database/contents/src/2014/en/5e-SRD-${name}.json?ref=${revision}`,'-H','Accept: application/vnd.github.raw+json'],{encoding:'utf8',maxBuffer:10_000_000}));
const classes=read('Classes').map(c=>({id:c.index,name:c.name,die:`d${c.hit_die}`,ability:c.spellcasting?.spellcasting_ability.name ?? ''}));
const levels=read('Levels').filter(l=>!l.subclass).map(l=>({class:l.class.index,level:l.level,slots:Array.from({length:9},(_,i)=>l.spellcasting?.[`spell_slots_level_${i+1}`]??0),cantrips:l.spellcasting?.cantrips_known??0,specific:l.class_specific??{}}));
const features=read('Features').map(f=>({id:`srd51:class:${f.index}`,subclass:f.subclass?.index??'',prerequisites:f.prerequisites??[]}));
const feats=read('Feats').map(f=>({id:`srd51:feat:${f.index}`,subclass:'',prerequisites:f.prerequisites??[]}));
const subclasses=read('Subclasses').map(s=>({id:s.index,class:s.class.index,name:s.name,spells:(s.spells??[]).map(r=>({id:`srd51:spell:${r.spell.index}`,level:Math.max(0,...r.prerequisites.filter(p=>p.type==='level').map(p=>Number(p.index.split('-').at(-1)))),features:r.prerequisites.filter(p=>p.type==='feature').map(p=>`srd51:class:${p.index}`)}))}));
writeFileSync(new URL('../src/data/srd-context.json',import.meta.url),JSON.stringify({revision,classes,levels,features:[...features,...feats],subclasses})+'\n');
console.log(`Context: ${classes.length} classes, ${levels.length} class levels, ${features.length+feats.length} feature prerequisites, ${subclasses.length} subclasses.`);
