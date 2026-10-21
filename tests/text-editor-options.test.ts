import {describe,it,expect} from 'vitest';
import {constrainText,textEditorAttributes} from '../src/ui/text-editor-options';
describe('per-field text editor settings',()=>{
 it('keeps multiline notes and restricts a single-line caller',()=>{
  expect(constrainText('Alva\r\nfra nord\nFighter',{multiline:true,maxLength:10000})).toBe('Alva\r\nfra nord\nFighter');
  expect(constrainText('Alva\r\nfra nord\nFighter',{multiline:false,maxLength:100})).toBe('Alva fra nord Fighter');
 });
 it('uses each instance limit, including zero, without splitting an emoji',()=>{
  expect(constrainText('ABCDEF',{maxLength:3})).toBe('ABC');
  expect(constrainText('ABCDEF',{maxLength:6})).toBe('ABCDEF');
  expect(constrainText('ABC',{maxLength:0})).toBe('');
  expect(constrainText('A😀B',{maxLength:2})).toBe('A');
 });
 it('carries explicit options from the caller and rejects invalid length configuration',()=>{
  expect(textEditorAttributes({multiline:false,maxLength:12})).toContain('data-text-multiline="false"');
  expect(textEditorAttributes({multiline:true,maxLength:240})).toContain('data-text-maxlength="240"');
  expect(()=>textEditorAttributes({maxLength:-1})).toThrow(RangeError);
 });
});
