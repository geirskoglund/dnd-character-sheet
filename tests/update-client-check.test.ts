import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {countAppTabs} from '../src/ui/update-client-check';
let ports:{close:ReturnType<typeof vi.fn>}[]=[];
beforeEach(()=>{
 ports=[];
 vi.stubGlobal('MessageChannel',class {
  port1={onmessage:null as null|((e:{data:unknown})=>void),onmessageerror:null as null|(()=>void),start:vi.fn(),close:vi.fn()};
  port2={postMessage:(data:unknown)=>queueMicrotask(()=>this.port1.onmessage?.({data})),close:vi.fn()};
  constructor(){ports.push(this.port1,this.port2);}
 });
});
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();});
const responding=(count:number)=>({postMessage:vi.fn((_data:unknown,transfer:MessagePort[])=>transfer[0].postMessage(count))}) as unknown as ServiceWorker;
it('uses the active worker and blocks multiple tabs even if waiting worker is silent',async()=>{
 const active=responding(2),waiting={postMessage:vi.fn()} as unknown as ServiceWorker;
 expect(await countAppTabs({active,waiting})).toBe(2);expect(waiting.postMessage).not.toHaveBeenCalled();expect(ports.every(p=>p.close.mock.calls.length===1)).toBe(true);
});
it('falls back to waiting after a missing active reply, using a fresh channel',async()=>{
 vi.useFakeTimers();const active={postMessage:vi.fn()} as unknown as ServiceWorker,waiting=responding(1);
 const result=countAppTabs({active,waiting},100);await vi.advanceTimersByTimeAsync(100);expect(await result).toBe(1);expect(ports).toHaveLength(4);
});
it('rejects missing and invalid replies without claiming other tabs exist',async()=>{
 vi.useFakeTimers();const waiting={postMessage:vi.fn()} as unknown as ServiceWorker;
 const failed=expect(countAppTabs({active:responding(0),waiting},100)).rejects.toThrow('bakgrunnsprosess svarer ikke');
 await vi.advanceTimersByTimeAsync(100);await failed;expect(ports.every(p=>p.close.mock.calls.length===1)).toBe(true);
});
it('handles posting failure and absent workers without allowing an unchecked activation',async()=>{
 const active={postMessage:()=>{throw Error('Dormant');}} as unknown as ServiceWorker;
 expect(await countAppTabs({active,waiting:responding(1)})).toBe(1);
 await expect(countAppTabs({active:null,waiting:null})).rejects.toThrow('Karakterdata er beholdt');
});
