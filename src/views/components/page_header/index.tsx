import { View, Text } from '@react-pdf/renderer';
import { PageHeaderType } from './index.types';

const PageHeader = (props: PageHeaderType) => {
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: !props.paintNameOnly && props.backgroundColor,
        borderRadius: !props.paintNameOnly ? '6px 6px 0px 0px' : '0px',
        padding: !props.paintNameOnly ? '10px 16px' : 'none',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '5px',
          alignItems: 'center',
        }}
      >
        {props.icon}
        <Text
          style={{
            color: !props.paintNameOnly ? '#FEFEFE' : '#222222',
            fontWeight: '500',
            fontSize: '14px',
          }}
        >
          {props.title}
        </Text>
      </View>
      <View
        style={
          props.paintNameOnly && {
            backgroundColor: '#6876BE',
            padding: '2px 8px',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }
        }
      >
        <Text
          style={{
            color:
              !props.paintNameOnly || props.backgroundColor === '#D5DFFD'
                ? '#FEFEFE'
                : '#3B4CA3',
            fontWeight: '500',
            fontSize: '12px',
          }}
        >
          {props.name}
        </Text>
      </View>
    </View>
  );
};

export default PageHeader;
