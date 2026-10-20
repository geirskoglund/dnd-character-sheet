/** Horizontal gestures change category; vertical movement remains native page scrolling. */
export function bindCombatSwipe(region:HTMLElement,select:(direction:number)=>void) {
  let start:{x:number;y:number;id:number}|undefined;
  let swiped=false;
  region.addEventListener('pointerdown',e=>{
    if(!e.isPrimary || (e.pointerType==='mouse' && e.button!==0) || (e.target as Element).closest('input,textarea,select'))return;
    start={x:e.clientX,y:e.clientY,id:e.pointerId};swiped=false;
  });
  region.addEventListener('pointermove',e=>{
    if(!start||start.id!==e.pointerId)return;
    const dx=e.clientX-start.x,dy=e.clientY-start.y;
    if(Math.abs(dy)>20 && Math.abs(dy)>Math.abs(dx)){start=undefined;return;}
    if(Math.abs(dx)>30 && Math.abs(dx)>Math.abs(dy)*1.5){region.setPointerCapture(e.pointerId);swiped=true;}
  });
  region.addEventListener('pointerup',e=>{
    if(!start||start.id!==e.pointerId)return;
    const dx=e.clientX-start.x,dy=e.clientY-start.y;start=undefined;
    if(Math.abs(dx)>=50 && Math.abs(dx)>Math.abs(dy)*1.5){swiped=true;select(dx<0?1:-1);}
  });
  region.addEventListener('pointercancel',()=>{start=undefined;});
  region.addEventListener('click',e=>{if(swiped){e.preventDefault();e.stopImmediatePropagation();swiped=false;}},true);
}
