import {describe, expect, it, vi} from 'vitest';
import {planPages, parseDeployment} from '../scripts/pages-plan.mjs';

const master = 'a'.repeat(40), oldPreview = 'b'.repeat(40), nextPreview = 'c'.repeat(40);
const previous = {version:1, production:{sha:oldPreview}, preview:{sha:oldPreview,pr:25}};
const pull = {state:'open',base:{ref:'master'},head:{sha:nextPreview,repo:{full_name:'owner/repo'}}};
function options(overrides = {}) {
  return {eventName:'workflow_dispatch',event:{},selection:'keep',productionSha:master,previous,repository:'owner/repo',
    getPull:vi.fn(async()=>pull),isValidated:vi.fn(async()=>true),...overrides};
}

describe('one fixed Pages preview',()=>{
  it('bootstraps both URLs from master without inventing a selected PR',async()=>{
    expect(await planPages(options({previous:undefined}))).toEqual({version:1,production:{sha:master},preview:{sha:master,pr:null}});
  });
  it('preserves the selected exact preview commit when production changes, even if its branch was deleted',async()=>{
    const input=options({eventName:'push'}),result=await planPages(input);
    expect(result).toEqual({...previous,production:{sha:master}});
    expect(input.getPull).not.toHaveBeenCalled();
  });
  it('explicitly selects a validated PR but never builds it as production',async()=>{
    const input=options({selection:'56'});
    expect(await planPages(input)).toEqual({version:1,production:{sha:master},preview:{sha:nextPreview,pr:56}});
    expect(input.isValidated).toHaveBeenCalledWith(nextPreview);
  });
  it('can explicitly return the preview to master without dropping local browser data',async()=>{
    expect((await planPages(options({selection:'master'}))).preview).toEqual({sha:master,pr:null});
  });
  it('updates only the selected PR after successful validation of its current head',async()=>{
    expect((await planPages(options({eventName:'workflow_run',event:{workflow_run:{event:'pull_request',conclusion:'success',head_sha:nextPreview}}}))).preview)
      .toEqual({sha:nextPreview,pr:25});
  });
  it.each([
    {event:'pull_request',conclusion:'failure',head_sha:nextPreview},
    {event:'push',conclusion:'success',head_sha:nextPreview},
    {event:'pull_request',conclusion:'success',head_sha:'d'.repeat(40)},
    {event:'pull_request',conclusion:'success',head_sha:oldPreview},
  ])('ignores failed, unrelated, or stale workflow runs: %j',async workflow_run=>{
    expect(await planPages(options({eventName:'workflow_run',event:{workflow_run}}))).toBeNull();
  });
  it('does not let unrelated PR validation select the test URL on its own',async()=>{
    expect(await planPages(options({previous:undefined,eventName:'workflow_run',event:{workflow_run:{event:'pull_request',conclusion:'success',head_sha:nextPreview}}}))).toBeNull();
  });
  it.each([
    {...pull,state:'closed'},
    {...pull,head:{...pull.head,repo:{full_name:'fork/repo'}}},
    {...pull,base:{ref:'another-branch'}},
  ])('rejects closed, forked, or differently targeted PRs',async candidate=>{
    await expect(planPages(options({selection:'56',getPull:async()=>candidate}))).rejects.toThrow('åpen PR');
  });
  it('refuses a PR without a successful Validate result',async()=>{
    await expect(planPages(options({selection:'56',isValidated:async()=>false}))).rejects.toThrow('grønn Validate');
  });
  it.each(['refs/pull/25/head','branch-name','25; echo unsafe','0','-1','9007199254740993'])('rejects ambiguous or executable selection %s',async selection=>{
    await expect(planPages(options({selection}))).rejects.toThrow('Velg keep');
  });
  it('does not silently reset corrupt published state',async()=>{
    expect(()=>parseDeployment({...previous,preview:{sha:'not-a-commit',pr:25}})).toThrow('Ugyldig');
    await expect(planPages(options({previous:{version:2}}))).rejects.toThrow('Ugyldig');
  });
});
