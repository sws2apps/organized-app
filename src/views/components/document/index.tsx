import { DocumentType } from './index.types';
import { Document as ReactPDFDocument } from '@react-pdf/renderer';

const Document = ({ title, children }: DocumentType) => {
  return (
    <ReactPDFDocument
      author="sws2apps"
      title={title}
      creator="Organized"
      producer="sws2apps (by react-pdf)"
    >
      {children}
    </ReactPDFDocument>
  );
};

export default Document;
