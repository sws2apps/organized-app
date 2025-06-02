import { PageType } from './index.types';
import { Page as ReactPDFPage } from '@react-pdf/renderer';

const Page = ({ font, children }: PageType) => {
  return (
    <ReactPDFPage
      size="A4"
      style={[
        { padding: '20px', backgroundColor: '#FFFFFF' },
        { fontFamily: font },
      ]}
    >
      {children}
    </ReactPDFPage>
  );
};

export default Page;
