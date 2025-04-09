import { LANGUAGE_LIST } from '@constants/index';
import { Page as ReactPDFPage } from '@react-pdf/renderer';
import { PageType } from './index.types';

const Page = (props: PageType) => {
  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === props.lang)
      ?.font || 'Inter';

  const padding = props.padding || '20px';

  return (
    <ReactPDFPage
      size="A4"
      style={[
        {
          backgroundColor: '#FFFFFF',
          padding: padding,
        },
        { fontFamily: font },
      ]}
    >
      {props.children}
    </ReactPDFPage>
  );
};

export default Page;
