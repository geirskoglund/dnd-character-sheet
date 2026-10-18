import { portraitSchema, type PortraitAsset } from '../domain/model';
/** Decode and resize locally. A new immutable asset keeps copy and undo independent. */
export async function portraitFromFile(file: File): Promise<PortraitAsset> {
  if (!['image/png','image/jpeg','image/webp'].includes(file.type)) throw new Error('Velg et PNG-, JPEG- eller WebP-bilde.');
  if (file.size > 10_000_000) throw new Error('Bildet er for stort. Velg et bilde under 10 MB.');
  const bitmap = await createImageBitmap(file).catch(()=> { throw new Error('Kunne ikke lese bildefilen.'); });
  try {
    if (!bitmap.width || !bitmap.height) throw new Error('Bildet er tomt.');
    const scale = Math.min(1,800 / Math.max(bitmap.width,bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1,Math.round(bitmap.width*scale)); canvas.height = Math.max(1,Math.round(bitmap.height*scale));
    canvas.getContext('2d')!.drawImage(bitmap,0,0,canvas.width,canvas.height);
    return portraitSchema.parse({id:crypto.randomUUID(),mimeType:'image/webp',dataUrl:canvas.toDataURL('image/webp',.85)});
  } finally { bitmap.close(); }
}
export function choosePortrait(): Promise<PortraitAsset | undefined> {
  return new Promise((resolve,reject) => {
    const input = document.createElement('input'); input.type='file'; input.accept='image/png,image/jpeg,image/webp';
    input.oncancel = () => resolve(undefined);
    input.onchange = () => { const file=input.files?.[0]; if (file) void portraitFromFile(file).then(resolve,reject); else resolve(undefined); };
    input.click();
  });
}
