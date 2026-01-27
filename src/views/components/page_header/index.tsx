import { View, Text } from '@react-pdf/renderer';
import { PageHeaderProps } from './index.types';
import { getCSSPropertyValue } from '@utils/common';

const PageHeader = ({
  variant,
  title,
  icon,
  congregationName,
  backgroundColor,
  fixed = true,
}: PageHeaderProps) => {
  switch (variant) {
    case 'main':
      return (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '10px 16px',
            backgroundColor: backgroundColor,
            borderTopLeftRadius: getCSSPropertyValue('--radius-m'),
            borderTopRightRadius: getCSSPropertyValue('--radius-m'),
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          fixed={fixed}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '5px',
            }}
          >
            {icon}
            <Text
              style={{
                fontWeight: 500,
                fontSize: '14px',
                color: '#FEFEFE',
              }}
            >
              {title}
            </Text>
          </View>
          <Text
            style={{
              fontWeight: 500,
              fontSize: '12px',
              color: '#FEFEFE',
            }}
          >
            {congregationName}
          </Text>
        </View>
      );
    case 'secondary':
      return (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          fixed={fixed}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '5px',
            }}
          >
            {icon}
            <Text
              style={{
                fontWeight: 500,
                fontSize: '14px',
                color: '#000000',
              }}
            >
              {title}
            </Text>
          </View>
          <View
            style={{
              borderRadius: '2px',
              padding: '2px 8px',
              backgroundColor: getCSSPropertyValue('--pdf-blue-main'),
            }}
          >
            <Text
              style={{
                fontWeight: 500,
                fontSize: '12px',
                color: '#FEFEFE',
              }}
            >
              {congregationName}
            </Text>
          </View>
        </View>
      );
  }
};

export default PageHeader;
