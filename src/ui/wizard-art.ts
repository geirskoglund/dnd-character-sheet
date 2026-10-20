import {icon,type UIIcon} from './icons';
export function diceArt(sides:string){
 const shapes:Record<string,string>={d4:'<path d="m32 5 27 49H5zM32 5v33L5 54m27-16 27 16"/>',d6:'<path d="m32 4 25 14v29L32 61 7 47V18zM7 18l25 14 25-14M32 32v29"/>',d8:'<path d="m32 3 27 29-27 29L5 32zM5 32h54M32 3 18 32l14 29 14-29z"/>',d10:'<path d="m32 3 26 22-9 28-17 8-17-8-9-28zM6 25l26 8 26-8M32 3v30l17 20M32 33 15 53m17-20v28"/>',d12:'<path d="m20 4 24 0 17 21-7 25-22 11L10 50 3 25zM20 4l1 17 22 0 1-17M21 21 12 37l20 14 20-14-9-16M12 37 3 25m9 12-2 13m22 1v10m20-24 9-12m-9 12 2 13"/>'};
 return `<svg class="die-art" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">${shapes[sides]??'<path d="m32 3 28 16v26L32 61 4 45V19zM4 19l28 16 28-16M32 35v26"/>'}</svg>`;
}
export function wizardArt(glyph:UIIcon='sword'){
 return `<div class="wizard-art" aria-hidden="true"><svg class="wizard-orbit" viewBox="0 0 260 130" fill="none"><ellipse cx="130" cy="65" rx="54" ry="53"/><ellipse cx="130" cy="65" rx="48" ry="47"/><path d="M7 65h57m132 0h57M19 60l-5 5 5 5m222-10 5 5-5 5M53 49l7 16-7 16m154-32-7 16 7 16M130 4v11m-5-6h10M130 115v11m-5-6h10"/><path d="m76 20 4 4-4 4-4-4zm108 82 4 4-4 4-4-4z"/></svg>${icon(glyph)}</div>`;
}
