import { View, Text } from '@react-pdf/renderer';
import { OSScheduleTalkBoxProps } from './index.types';
import { getCSSPropertyValue } from '@utils/common';
import IconSong from '@views/components/icons/IconSong';

const OSScheduleTalkBox = ({ talkAndSong }: OSScheduleTalkBoxProps) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '5px',
      }}
    >
      <Text
        style={{
          fontWeight: 600,
          fontSize: '10px',
          color: getCSSPropertyValue('--pdf-green-main'),
        }}
      >
        {talkAndSong.song.title}
        <Text
          style={{
            fontSize: '8px',
            fontWeight: 500,
            color: '#9BBCA3',
          }}
        >
          {` №${talkAndSong.song.number}`}
        </Text>
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '2px',
        }}
      >
        <IconSong color={'#498457'} />
        <Text
          style={{
            fontSize: '9px',
            fontWeight: 600,
            color: getCSSPropertyValue('--pdf-green-main'),
          }}
        >
          {`${talkAndSong.talk.number}. `}
          <Text
            style={{
              fontSize: '9px',
              fontWeight: 400,
              color: getCSSPropertyValue('--pdf-green-main'),
            }}
          >
            {talkAndSong.talk.title}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default OSScheduleTalkBox;
