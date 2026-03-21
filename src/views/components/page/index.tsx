import { Page as ReactPDFPage } from '@react-pdf/renderer';
import { PageType } from './index.types';

const Page = ({ children }: PageType) => {
  return (
    <ReactPDFPage
      size="A4"
      style={{
        padding: '20px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {children}
    </ReactPDFPage>
  );
};

export default Page;
