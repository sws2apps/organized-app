import { Page as ReactPDFPage } from '@react-pdf/renderer';
import { LANGUAGE_LIST } from '@constants/index';
import { PageType } from './index.types';

const Page = ({ lang, children }: PageType) => {
  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.font ||
    'Inter';

  return (
    <ReactPDFPage
      size="A4"
      style={[
        {
          padding: '20px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
        { fontFamily: font },
      ]}
    >
      {children}
    </ReactPDFPage>
  );
};

export default Page;
