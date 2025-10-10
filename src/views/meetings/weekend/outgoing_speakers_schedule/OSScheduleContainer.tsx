import { View } from '@react-pdf/renderer';
import { OSScheduleContainerProps } from './index.types';
import { getCSSPropertyValue } from '@utils/common';
import { OutgoingSpeakersScheduleType } from '@definition/schedules';
import OSScheduleSpeakBox from './OSScheduleSpeakBox';

const OSScheduleContainer = ({ data }: OSScheduleContainerProps) => {
  const groupByDate = (
    speakers: OutgoingSpeakersScheduleType
  ): OutgoingSpeakersScheduleType[] => {
    const groups = speakers.speak.reduce<Record<number, typeof speakers.speak>>(
      (acc, item) => {
        const key = item.date.date.getTime();
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {}
    );

    return Object.values(groups)
      .map((speakArr) => ({ speak: speakArr }))
      .sort(
        (x, y) =>
          x.speak[0].date.date.getTime() - y.speak[0].date.date.getTime()
      );
  };

  const groupedSpeakByDate = groupByDate(data);

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
      {groupedSpeakByDate.map((speak, index) => (
        <OSScheduleSpeakBox
          data={speak}
          key={index}
          last={index === groupedSpeakByDate.length - 1}
        />
      ))}
    </View>
  );
};

export default OSScheduleContainer;
