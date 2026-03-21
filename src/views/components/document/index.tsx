import { Document as ReactPDFDocument } from '@react-pdf/renderer';
import { PDFDocumentType } from './index.types';
import { LANGUAGE_LIST } from '@constants/index';
import registerFonts from '@views/registerFonts';

registerFonts();

const Document = ({ title, children, lang }: PDFDocumentType) => {
  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.font ??
    'Inter';

  const direction = (LANGUAGE_LIST.find(
    (record) => record.threeLettersCode === lang
  )?.direction ?? 'ltr') as 'ltr' | 'rtl';

  return (
    <ReactPDFDocument
      author="sws2apps"
      title={title}
      creator="Organized"
      producer="sws2apps (by react-pdf)"
      style={{ fontFamily: font, direction }}
    >
      {children}
    </ReactPDFDocument>
  );
};

export default Document;
