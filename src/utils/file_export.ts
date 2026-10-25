/** A portable filename, including Windows device names and forbidden characters. */
export const exportFileName = (name: string) => {
  const cleaned = Array.from(name)
    .map((character) =>
      character.codePointAt(0)! < 32 || /[<>:"/\\|?*]/.test(character)
        ? '-'
        : character
    )
    .join('')
    .trim();
  let end = cleaned.length;
  while (end > 0 && (cleaned[end - 1] === '.' || cleaned[end - 1] === ' '))
    end--;
  const portable = cleaned.slice(0, end);
  if (!portable) return 'export';
  return /^(con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(portable)
    ? `_${portable}`
    : portable;
};
