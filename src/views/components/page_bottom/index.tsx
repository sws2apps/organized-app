import { View, Text } from '@react-pdf/renderer';
import { PageBottomProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import { getCSSPropertyValue } from '@utils/common';
import { formatDate } from '@utils/date';

const PageBottom = ({
  qrCode,
  created,
  fixed,
  shortDateFormat,
}: PageBottomProps) => {
  const { t } = useAppTranslation();
  return (
    <View
      style={{
        borderRadius: '4px',
        padding: '6px 12px 6px 6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #D5DFFD',
        gap: '40px',
      }}
      fixed={fixed}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        {qrCode}
        <Text
          style={{
            fontWeight: 400,
            fontSize: '10px',
            color: '#505050',
          }}
        >
          {t('tr_findScheduleByScanningQRCode')}
        </Text>
      </View>
      <View
        style={{
          borderRadius: getCSSPropertyValue('--radius-xs'),
          padding: '4px 6px',
          backgroundColor: '#F2F5FF',
        }}
      >
        <Text
          style={{
            fontWeight: 500,
            fontSize: '10px',
            color: '#606D93',
          }}
        >
          {t('tr_created', { date: formatDate(created, shortDateFormat) })}
        </Text>
      </View>
    </View>
  );
};

export default PageBottom;
