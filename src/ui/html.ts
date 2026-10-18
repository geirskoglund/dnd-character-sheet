export const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g,
  char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
export const field = (label: string, name: string, value: unknown, options = '') =>
  `<label>${escapeHtml(label)}<input name="${name}" value="${escapeHtml(value)}" ${options}></label>`;
export const select = (label: string, name: string, value: string, options: { value: string; label: string }[], attrs = '') =>
  `<label>${escapeHtml(label)}<select name="${name}" ${attrs}>${options.map(o => `<option value="${escapeHtml(o.value)}" ${o.value === value ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join('')}</select></label>`;
