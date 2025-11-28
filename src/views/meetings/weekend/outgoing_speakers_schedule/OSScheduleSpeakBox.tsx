import { View } from '@react-pdf/renderer';
import { OSScheduleSpeakBoxProps } from './index.types';
import OSScheduleDateBox from './OSScheduleDateBox';
import OSScheduleTalkBox from './OSScheduleTalkBox';
import OSScheduleBrotherBox from './OSScheduleBrotherBox';
import { Fragment } from 'react/jsx-runtime';

const OSScheduleSpeakBox = ({ data, last }: OSScheduleSpeakBoxProps) => {
  return (
    <View
      style={{
        borderBottom: last ? 'none' : `1px solid #D7E3DA`,
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        paddingRight: '10px',
      }}
    >
      <OSScheduleDateBox
        formattedDate={data.speak[0].date.formatted}
        last={last}
      />

      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {data.speak.map((speak, index) => (
          <Fragment key={`${index}_${speak.speaker}_${speak.date}`}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingVertical: '12px',
                gap: '10px',
              }}
            >
              <OSScheduleBrotherBox
                speaker={{
                  speaker: speak.speaker,
                  congregation: speak.congregation_name,
                }}
              />
              <View
                style={{
                  width: '1px',
                  height: '100%',
                  backgroundColor: '#D7E3DA',
                }}
              />
              <OSScheduleTalkBox
                talkAndSong={{
                  song: speak.opening_song,
                  talk: speak.public_talk,
                }}
              />
            </View>
            {index != data.speak.length - 1 && (
              <View style={{ height: '1px', backgroundColor: '#EEF6EB' }} />
            )}
          </Fragment>
        ))}
      </View>
    </View>
  );
};

export default OSScheduleSpeakBox;
