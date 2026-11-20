import {
  EXTRA,
  REGULAR,
  SEMIBOLD,
} from '@views/territories/shared/interWidths';

// react-pdf cannot measure before layout, so Inter's own glyph widths
// stand in; kerning is left out, which only errs on the wide side
const SAFETY = 0.99;

const table = (hex: string) => {
  const widths = new Map<string, number>();
  const chars = [
    ...Array.from({ length: 0x160 }, (_, i) => String.fromCodePoint(0x20 + i)),
    ...EXTRA,
  ];
  chars.forEach((char, i) =>
    widths.set(char, Number.parseInt(hex.slice(i * 3, i * 3 + 3), 16) / 1000)
  );
  return widths;
};
const WIDTHS = { regular: table(REGULAR), bold: table(SEMIBOLD) };

const glyph = (char: string, bold: boolean) => {
  const known = WIDTHS[bold ? 'bold' : 'regular'].get(char);
  if (known !== undefined) return known;
  // CJK and other full-width scripts; anything else as a wide letter
  return char.codePointAt(0)! >= 0x2e80 ? 1 : 0.7;
};

export const textWidth = (text: string, size: number, bold = false) =>
  [...text].reduce((sum, char) => sum + glyph(char, bold), 0) * size;

export const fits = (width: number, room: number) => width <= room * SAFETY;

// cut at a word, so the ellipsis follows a whole word, unless that would
// leave a tenth of the row empty: then the next word is cut instead
export const fitText = (
  text: string,
  size: number,
  room: number,
  bold = false
) => {
  if (fits(textWidth(text, size, bold), room)) return text;

  const width = (value: string) => textWidth(`${value}…`, size, bold);
  const words = text.split(/\s+/);
  let kept = 0;
  while (
    kept < words.length &&
    fits(width(words.slice(0, kept + 1).join(' ')), room)
  )
    kept++;

  let cut = words.slice(0, kept).join(' ');
  if (kept < words.length && fits(width(cut), room * 0.9)) {
    const next = words[kept];
    let chars = 0;
    const partial = (n: number) => `${cut}${cut ? ' ' : ''}${next.slice(0, n)}`;
    while (chars < next.length && fits(width(partial(chars + 1)), room))
      chars++;
    if (chars > 0) cut = partial(chars);
  }
  let end = cut.length;
  while (end > 0 && /[\s,;:.!?–-]/.test(cut[end - 1])) end--;
  return `${cut.slice(0, end)}…`;
};
