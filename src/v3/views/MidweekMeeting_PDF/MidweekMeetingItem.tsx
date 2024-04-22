import React from 'react';
import { View, Font } from '@react-pdf/renderer';
import InterRegular from '@assets/fonts/Inter-Regular.ttf';
import InterSemiBold from '@assets/fonts/Inter-SemiBold.ttf';
import InterMedium from '@assets/fonts/Inter-Medium.ttf';
import InterLight from '@assets/fonts/Inter-Light.ttf';
import DiamondSvg from './Svg/DiamondSvg';
import LivingSvg from './Svg/LivingSvg';
import MinistrySvg from './Svg/MinistrySvg';
import MidweekMeetingSong from './MidweekMeetingSong';
import MidweekMeetingItemHeader from './MidweekMeetingItemHeader';
import MidweekMeetingTime from './MidweekMeetingTime';
import MeetingPartsTitle from './MidweekMeetingPartsTitle';
import MidweekMeetingTask from './MidweekMeetingTask';
import { MidweekMeetingItemProps } from './midweekMeeting.types';

Font.register({
  family: 'Inter',
  fonts: [
    { src: InterLight, fontWeight: 'light' },
    { src: InterRegular, fontWeight: 'normal' },
    { src: InterMedium, fontWeight: 'medium' },
    { src: InterSemiBold, fontWeight: 'semibold' },
  ],
});

const MidweekMeetingItem = ({ meetingData, tasks }: MidweekMeetingItemProps) => {
  const meetingStartTime = meetingData.meetingStartTime;

  let startTime = meetingStartTime;
  let previousStartTime = meetingStartTime;

  const addTime = (startMTime, duration) => {
    const [hours, minutes] = startMTime.split(':').map(Number);
    const [durationMinutes] = duration.match(/\d+/g).map(Number);

    const totalMinutes = hours * 60 + minutes + durationMinutes;

    const nextHours = Math.floor(totalMinutes / 60);
    const nextMinutes = totalMinutes % 60;
    const time = `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;

    return time;
  };

  const handleTimeUpdate = (newTime) => {
    previousStartTime = startTime;
    startTime = newTime;
  };

  const getPartColor = (part) => {
    switch (part) {
      case 'Treasures from God’s Word':
        return '#3C7F8B';
      case 'Apply yourself to the field ministry':
        return '#C28200';
      case 'Living as christians':
        return '#B82B10';
      default:
        return null;
    }
  };

  const getPartTextColor = (part) => {
    switch (part) {
      case 'Start of Meeting':
        return '#3B4CA3';
      case 'Treasures from God’s Word':
        return '#2A6B77';
      case 'Apply yourself to the field ministry':
        return '#956711';
      case 'Living as christians':
        return '#942926';
      default:
        return null;
    }
  };

  const getPartBgColor = (part) => {
    switch (part) {
      case 'Start of Meeting':
        return null;
      case 'Treasures from God’s Word':
        return '#ECF6F8';
      case 'Apply yourself to the field ministry':
        return '#FDF5E4';
      case 'Living as christians':
        return '#FFF3F1';
      default:
        return null;
    }
  };

  const getPartIcon = (part) => {
    switch (part) {
      case 'Treasures from God’s Word':
        return <DiamondSvg />;
      case 'Apply yourself to the field ministry':
        return <MinistrySvg />;
      case 'Living as christians':
        return <LivingSvg />;
      default:
        return null;
    }
  };

  const sortedTasks = tasks
    .sort((a, b) => {
      const partOrder = {
        'Start of Meeting': 1,
        'Treasures from God’s Word': 2,
        'Apply yourself to the field ministry': 3,
        'Living as Christians': 4,
      };

      return partOrder[a.part] - partOrder[b.part];
    })
    .reduce((acc, task) => {
      if (!acc[task.part]) {
        acc[task.part] = [];
      }
      acc[task.part].push(task);

      acc[task.part].sort((a, b) => parseInt(a.taskNumber) - parseInt(b.taskNumber));

      return acc;
    }, {});

  return (
    <>
      <MidweekMeetingItemHeader date={meetingData.date} WeeklyBibleReading={meetingData.WeeklyBibleReading} />
      <View>
        {Object.keys(sortedTasks).map((part) => (
          <React.Fragment key={part}>
            {part === 'Start of Meeting' ? null : (
              <MeetingPartsTitle
                part={part}
                color={getPartColor(part)}
                icon={getPartIcon(part)}
                taskConductor={
                  part === 'Apply yourself to the field ministry' ? sortedTasks[part][0]?.taskConductor : null
                }
              />
            )}
            {sortedTasks[part].map((task, index) => {
              const taskStartTime = previousStartTime;
              const taskEndTime = addTime(taskStartTime, task.taskTime);
              handleTimeUpdate(taskEndTime);
              previousStartTime = taskEndTime;

              return (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 4,
                    backgroundColor: index % 2 !== 0 ? getPartBgColor(part) : 'transparent',
                  }}
                  key={index}
                >
                  <MidweekMeetingTime time={taskStartTime} textColor={getPartTextColor(part)} />
                  {task.taskTitle === 'Song' ? (
                    <MidweekMeetingSong prayer={task.prayer} name={task.name} songNumber={task.songNumber} />
                  ) : (
                    <MidweekMeetingTask
                      part={task.part}
                      taskNumber={task.taskNumber}
                      taskTitle={task.taskTitle}
                      taskTime={task.taskTime}
                      taskConductor={task.taskConductor}
                      textColor={getPartTextColor(part)}
                    />
                  )}
                </View>
              );
            })}
          </React.Fragment>
        ))}
      </View>
    </>
  );
};

export default MidweekMeetingItem;
