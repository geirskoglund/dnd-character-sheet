import {describe,it,expect} from 'vitest';
import {changeBounds,changeResult,normaliseChange,parseWheelInteger} from '../src/domain/number-change';

describe('issue #25: additive number changes',()=>{
 it('keeps the original basis and derives result bounds (P04–P08/P16)',()=>{
  expect(changeResult(22,6)).toBe(28);expect(changeResult(22,-4)).toBe(18);
  expect(normaliseChange(3,-10)).toBe(-3);
  expect(normaliseChange(22,100,{max:30})).toBe(8);
  expect(normaliseChange(2,-5,{allowNegative:true})).toBe(-5);
  expect(normaliseChange(2,-50,{min:-10,max:30})).toBe(-12);
  expect(normaliseChange(2,50,{min:-10,max:30})).toBe(28);
 });
 it('has no arbitrary product ceiling and retains safe integer precision',()=>{
  expect(changeBounds(22).max).toBe(Number.MAX_SAFE_INTEGER-22);
  expect(normaliseChange(22,2_000_000_000)).toBe(2_000_000_000);
  expect(changeResult(Number.MAX_SAFE_INTEGER-1,1)).toBe(Number.MAX_SAFE_INTEGER);
  expect(normaliseChange(0,9007199254741000n)).toBe(Number.MAX_SAFE_INTEGER);
 });
 it('combines signed decimal wheels exactly in scaled integer units',()=>{
  expect(changeResult(0,9*100+80)).toBe(980);
  expect(changeResult(0,10*100-20)).toBe(980);
  expect(changeResult(1050,normaliseChange(1050,-10*100-50))).toBe(0);
  expect(normaliseChange(1050,-1100)).toBe(-1050);
 });
 it('accepts only signed whole wheel numbers (K4/K5)',()=>{
  expect(parseWheelInteger('-10')).toBe(-10);expect(parseWheelInteger('+10')).toBe(10);
  expect(parseWheelInteger('0')).toBe(0);
  for(const value of ['','-','1.2','1,2','1e3','NaN','Infinity','9007199254740992'])expect(parseWheelInteger(value)).toBeNull();
 });
});
