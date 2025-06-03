import { View } from '@react-pdf/renderer';
import { PageContentType } from './index.types';

const PageContent = ({ gap, children }: PageContentType) => {
  const contentGap = gap ?? 16;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: contentGap,
      }}
    >
      {children}
    </View>
  );
};

export default PageContent;
