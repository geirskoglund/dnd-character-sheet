import {z} from 'zod';
export const draftPrefix='wizard-draft:';
export const wizardDraftSchema=z.object({
 id:z.uuid(),version:z.literal(1),revision:z.number().int().nonnegative(),
 kind:z.enum(['equipment','feature','spell','cantrip','species','resource','character','consumable']),
 characterId:z.uuid().optional(),editingId:z.uuid().optional(),label:z.string().max(100),updatedAt:z.iso.datetime(),
 payload:z.unknown(),step:z.string().max(250),
 controls:z.array(z.object({name:z.string().max(250),index:z.number().int().nonnegative(),value:z.string().max(10000),checked:z.boolean().optional()})).max(1500),
});
export type WizardDraft=z.infer<typeof wizardDraftSchema>;
export type DraftToken=Pick<WizardDraft,'id'|'revision'>;
export function newWizardDraft(input:Pick<WizardDraft,'kind'|'payload'|'label'>&Partial<Pick<WizardDraft,'characterId'|'editingId'>>):WizardDraft{
 return {id:crypto.randomUUID(),version:1,revision:0,updatedAt:new Date().toISOString(),step:'',controls:[],...input};
}
