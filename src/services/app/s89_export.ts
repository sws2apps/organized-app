import JSZip from 'jszip';
import type { S89DataType } from '@definition/schedules';

// Keep even four-byte Unicode names below common filesystem filename limits.
const MAX_FILENAME_NAME_LENGTH = 40;

const safeStudentName = (name: string) =>
  Array.from(name)
    .slice(0, MAX_FILENAME_NAME_LENGTH)
    .map((character) =>
      character.codePointAt(0)! < 32 || /[\\/:*?"<>|]/.test(character)
        ? '_'
        : character
    )
    .join('')
    .trim()
    .replace(/\s+/g, '_');

export const createS89Archive = async (
  cards: S89DataType[],
  renderCard: (card: S89DataType) => Promise<Blob>
) => {
  const zip = new JSZip();

  for (const [index, card] of cards.entries()) {
    const week = card.weekOf.replaceAll('/', '');
    const filename = `S-89_${week}_${safeStudentName(card.student_name)}_${index + 1}.pdf`;
    const blob = await renderCard(card);
    zip.file(filename, await blob.arrayBuffer());
  }

  return zip.generateAsync({ type: 'blob' });
};
