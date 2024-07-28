import { PDFViewer } from '@react-pdf/renderer';

const PdfPreview = () => {
  return (
    <PDFViewer
      width={'100%'}
      height={1080}
      style={{ opacity: 100 }}
    ></PDFViewer>
  );
};

export default PdfPreview;
