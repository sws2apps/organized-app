// case and accents fold away, so "muller" finds "Müller" and "strasse" "Straße"
const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('ß', 'ss')
    .toLowerCase();

// every word typed is part of the name, in any order: "web an" finds "Anna Weber"
export const matchesName = (name: string, query: string) => {
  const folded = fold(name);

  return fold(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => folded.includes(word));
};
