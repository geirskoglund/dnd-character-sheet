export const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g,
  char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
export const field = (label: string, name: string, value: unknown, options = '') =>
  `<label>${escapeHtml(label)}<input name="${name}" value="${escapeHtml(value)}" ${options}></label>`;
