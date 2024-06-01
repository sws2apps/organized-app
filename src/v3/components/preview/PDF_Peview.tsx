import { WeekendMeeting, MidweekMeeting } from '../../views/index';
import { PDFViewer, Page, Document } from '@react-pdf/renderer';
import React from 'react';

const PdfPreview = () => {
  return (
    <PDFViewer width={'100%'} height={1500}>
      <>
        <Document>
          <Page size="A4">
            <MidweekMeeting />
          </Page>
          <Page size="A4">
            <WeekendMeeting />
          </Page>
        </Document>
      </>
    </PDFViewer>
  );
};

export default PdfPreview;
