/** A missing worker reply is not evidence that other tabs exist. Never fail open. */
function query(worker:ServiceWorker,timeoutMs:number):Promise<number>{
 return new Promise((resolve,reject)=>{
  const channel=new MessageChannel();let settled=false;
  const finish=(count?:number)=>{
   if(settled)return;settled=true;clearTimeout(timer);channel.port1.close();channel.port2.close();
   if(count!==undefined&&Number.isInteger(count)&&count>=1)resolve(count);else reject(new Error('Ingen gyldig respons fra appens bakgrunnsprosess.'));
  };
  const timer=setTimeout(()=>finish(),timeoutMs);
  channel.port1.onmessage=e=>finish(e.data);channel.port1.onmessageerror=()=>finish();channel.port1.start();
  try{worker.postMessage({type:'COUNT_APP_TABS'},[channel.port2]);}catch{finish();}
 });
}
export async function countAppTabs(registration:Pick<ServiceWorkerRegistration,'active'|'waiting'>,timeoutMs=3000):Promise<number>{
 // An installed/waiting worker can be dormant on mobile. The active worker knows the same scope.
 const workers=[...new Set([registration.active,registration.waiting].filter((w):w is ServiceWorker=>!!w))];
 for(const worker of workers){try{return await query(worker,timeoutMs);}catch{/* Try the other worker with a fresh channel. */}}
 throw new Error('Appens bakgrunnsprosess svarer ikke. Lukk appen helt og åpne den igjen før du prøver å oppdatere. Karakterdata er beholdt.');
}
