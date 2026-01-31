import { View } from '@react-pdf/renderer';
import { OSScheduleContainerProps } from './index.types';
import { getCSSPropertyValue } from '@utils/common';
import OSScheduleSpeakBox from './OSScheduleSpeakBox';

const OSScheduleContainer = ({ data }: OSScheduleContainerProps) => {
  return (
    <View
      style={{
        borderRight: '1px',
        borderBottom: '1px',
        borderLeft: '1px',
        borderColor: '#D7E3DA',
        borderBottomLeftRadius: getCSSPropertyValue('--radius-m'),
        borderBottomRightRadius: getCSSPropertyValue('--radius-m'),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {data.map((speakGroup, index) => (
        <OSScheduleSpeakBox
          data={speakGroup}
          key={index}
          last={index === data.length - 1}
        />
      ))}
    </View>
  );
};

export default OSScheduleContainer;
