export type MidweekMeetingItemHeaderProps = {
  date: string;
  WeeklyBibleReading: string;
};

export type SvgProps = {
  width: number;
  height: number;
};

export type TaskConductor = {
  mainHall: { first: string; second: string };
  AuxillilaryClassroom1: { first: string; second: string };
};

export type MeetingPartsTitleProps = {
  part: string;
  color: string;
  icon: JSX.Element;
  taskConductor?: string | TaskConductor;
};

export type MidweekMeetingSongProps = {
  prayer: boolean;
  name?: string;
  songNumber: string;
};

export type MidweekMeetingTimeProps = {
  time: string;
  textColor: string;
};

export type MidweekMeetingTaskProps = {
  taskNumber: string;
  taskTitle: string;
  taskTime: string;
  taskConductor: string | TaskConductor;
  textColor: string;
  part: string;
};

type Task = {
  part: string;
  taskTitle: string;
  taskTime: string;
  taskConductor?: string | Record<string, { first: string; second?: string }>;
  taskNumber?: string;
  prayer?: boolean;
  name?: string;
  songNumber?: string;
};

export type MidweekMeetingItemProps = {
  meetingData: {
    meetingStartTime: string;
    date: string;
    WeeklyBibleReading: string;
  };
  tasks: Task[];
};
