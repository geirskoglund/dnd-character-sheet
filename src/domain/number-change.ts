/** All arithmetic uses integer storage units (e.g. CP), never floating point GP. */
export interface ChangeLimits {min?:number;max?:number;allowNegative?:boolean}
export function parseWheelInteger(text:string):number|null {
 if(!/^[+-]?\d+$/.test(text.trim()))return null;
 const value=Number(text);return Number.isSafeInteger(value)?value:null;
}
export function changeBounds(original:number,limits:ChangeLimits={}) {
 const min=limits.min??(limits.allowNegative?-Number.MAX_SAFE_INTEGER:0),max=limits.max??Number.MAX_SAFE_INTEGER;
 if(![original,min,max].every(Number.isSafeInteger)||min>max)throw Error('Ugyldige tallgrenser.');
 const safe=BigInt(Number.MAX_SAFE_INTEGER),low=BigInt(min)-BigInt(original),high=BigInt(max)-BigInt(original);
 return {min:Number(low < -safe ? -safe : low),max:Number(high > safe ? safe : high)};
}
export function normaliseChange(original:number,delta:number|bigint,limits:ChangeLimits={}) {
 const bounds=changeBounds(original,limits),candidate=BigInt(delta);
 return Number(candidate<BigInt(bounds.min)?BigInt(bounds.min):candidate>BigInt(bounds.max)?BigInt(bounds.max):candidate);
}
export function changeResult(original:number,delta:number) {
 const value=BigInt(original)+BigInt(delta),result=Number(value);
 if(!Number.isSafeInteger(result))throw Error('Verdien er utenfor støttet tallområde.');
 return result;
}
