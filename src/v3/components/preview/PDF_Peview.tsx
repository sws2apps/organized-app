import { WeekendMeeting, MidweekMeeting } from '../../views/index';
import { PDFViewer } from '@react-pdf/renderer';
import React from 'react';

const PdfPreview = () => {
  return (
    <PDFViewer width={'100%'} height={1500}>
      <>
        {/* <WeekendMeeting /> */}
        <MidweekMeeting />
      </>
    </PDFViewer>
  );
};

export default PdfPreview;
