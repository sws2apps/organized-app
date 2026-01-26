import { View, Text } from '@react-pdf/renderer';
import { OSScheduleDateBoxProps } from './index.types';
import { getCSSPropertyValue } from '@utils/common';

const OSScheduleDateBox = ({ formattedDate, last }: OSScheduleDateBoxProps) => {
  return (
    <View
      style={{
        backgroundColor: getCSSPropertyValue('--pdf-green-light'),
        borderBottomLeftRadius: last ? getCSSPropertyValue('--radius-m') : '0',
        borderRight: `1px solid #D7E3DA`,
        paddingRight: '4px',
        paddingLeft: '4px',
        display: 'flex',
        width: '56px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: getCSSPropertyValue('--pdf-green-main'),
          fontWeight: 600,
          fontSize: '9px',
          textAlign: 'center',
        }}
      >
        {formattedDate}
      </Text>
    </View>
  );
};

export default OSScheduleDateBox;
