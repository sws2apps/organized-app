import { View, Text } from '@react-pdf/renderer';
import { OSScheduleBrotherBoxProps } from './index.types';
import { useAppTranslation } from '@hooks/index';

const OSScheduleBrotherBox = ({ speaker }: OSScheduleBrotherBoxProps) => {
  const { t } = useAppTranslation();

  const congregationWithSoftWrap = speaker.congregation.replace(/-/g, '\u00AD');

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ width: '97px' }}>
          <Text style={{ color: '#757575', fontWeight: 400, fontSize: '9px' }}>
            {`${t('tr_speaker')}:`}
          </Text>
        </View>
        <View style={{ width: '97px' }}>
          <Text
            style={{
              color: '#222222',
              fontWeight: 500,
              fontSize: '10px',
            }}
          >
            {speaker.speaker}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ width: '97px' }}>
          <Text style={{ color: '#757575', fontWeight: 400, fontSize: '9px' }}>
            {`${t('tr_congregation')}:`}
          </Text>
        </View>
        <View
          style={{
            width: '97px',
          }}
        >
          <Text
            style={{
              color: '#222222',
              fontWeight: 300,
              fontSize: '10px',
            }}
          >
            {congregationWithSoftWrap}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OSScheduleBrotherBox;
