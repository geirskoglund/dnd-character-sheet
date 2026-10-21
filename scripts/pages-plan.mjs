const validSha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);

/** Only metadata is consumed from the published site; never code or shell text. */
export function parseDeployment(value) {
  if (!value || value.version !== 1 || !validSha(value.production?.sha) || !validSha(value.preview?.sha) ||
      !(value.preview.pr === null || (Number.isSafeInteger(value.preview.pr) && value.preview.pr > 0))) {
    throw new Error('Ugyldig publiseringsmetadata. Velg master eller et PR-nummer eksplisitt; eksisterende nettsted er beholdt.');
  }
  return {version:1, production:{sha:value.production.sha}, preview:{sha:value.preview.sha, pr:value.preview.pr}};
}

/** Production always follows master; publishing master never resets the chosen preview. */
export async function planPages({selection = 'keep', eventName, event, productionSha, previous, repository, getPull, isValidated}) {
  if (!validSha(productionSha)) throw new Error('Ugyldig master-commit.');
  let preview;
  if (selection === 'master') preview = {sha:productionSha, pr:null};
  else if (selection === 'keep') preview = previous ? parseDeployment(previous).preview : {sha:productionSha, pr:null};
  else if (/^[1-9][0-9]*$/.test(selection) && Number.isSafeInteger(Number(selection))) {
    preview = {pr:Number(selection)};
  } else throw new Error('Velg keep, master eller et PR-nummer.');

  if (eventName === 'workflow_run') {
    if (event.workflow_run?.conclusion !== 'success' || event.workflow_run?.event !== 'pull_request' || !preview.pr) return null;
    const pull = await getPull(preview.pr);
    if (pull.state !== 'open' || pull.head.repo?.full_name !== repository || pull.base.ref !== 'master' ||
        pull.head.sha !== event.workflow_run.head_sha || pull.head.sha === preview.sha) return null;
    preview = {pr:preview.pr, sha:pull.head.sha};
  } else if (preview.sha === undefined) {
    const pull = await getPull(preview.pr);
    if (pull.state !== 'open' || pull.head.repo?.full_name !== repository || pull.base.ref !== 'master') {
      throw new Error('Testadressen krever en åpen PR fra dette repoet mot master.');
    }
    preview.sha = pull.head.sha;
  }
  if (!validSha(preview.sha)) throw new Error('Ugyldig test-commit.');
  if (preview.pr && (!previous || preview.sha !== previous.preview.sha) && !await isValidated(preview.sha)) {
    throw new Error('PR-hodet må ha grønn Validate før testpublisering.');
  }
  return {version:1, production:{sha:productionSha}, preview};
}
