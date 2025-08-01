import { View } from '@react-pdf/renderer';
import { PageContentProps } from './index.types';

const PageContent = ({ gap, children }: PageContentProps) => {
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
