/** Stable storage identity: a new PR/commit must never create a new test database. */
export const isTestApp = import.meta.env.VITE_APP_CHANNEL === 'test';
export const databaseName = isTestApp ? 'dnd-character-companion-test' : 'dnd-character-companion';
const pr = import.meta.env.VITE_PREVIEW_PR;
export const testVersion = isTestApp
  ? `Testversjon · ${pr ? `PR #${pr}` : 'master'} · ${__APP_VERSION__}`
  : '';
