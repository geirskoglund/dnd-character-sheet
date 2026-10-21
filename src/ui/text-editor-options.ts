/** Settings belong to the caller; names and descriptions need different editors. */
export interface TextEditorFieldOptions {
  multiline?: boolean;
  maxLength?: number;
}
export function textEditorAttributes(options: TextEditorFieldOptions = {}) {
  const length = options.maxLength;
  if (length !== undefined && (!Number.isSafeInteger(length) || length < 0)) throw new RangeError('maxLength må være et ikke-negativt heltall.');
  return `${options.multiline === undefined ? '' : ` data-text-multiline="${options.multiline}"`}${length === undefined ? '' : ` data-text-maxlength="${length}"`}`;
}
/** Apply constraints only to the editor's local typing, never to the stored caller on opening. */
export function constrainText(value: string, options: TextEditorFieldOptions) {
  let text = options.multiline === false ? value.replace(/[\r\n]+/g, ' ') : value;
  if (options.maxLength !== undefined && text.length > options.maxLength) {
    text = text.slice(0, options.maxLength);
    // Native maxlength counts UTF-16 units; never leave half an emoji at the boundary.
    if (/[\uD800-\uDBFF]$/.test(text)) text = text.slice(0, -1);
  }
  return text;
}
