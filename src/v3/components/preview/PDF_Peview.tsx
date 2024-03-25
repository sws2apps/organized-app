import { WeekendMeeting } from '../../views/index';
import { PDFViewer } from '@react-pdf/renderer';

const PdfPreview = () => {
  return (
    <PDFViewer width={'100%'} height={1500}>
      <WeekendMeeting />
    </PDFViewer>
  );
};

export default PdfPreview;
