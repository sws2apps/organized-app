import { MidweekMeetingDataType } from '@definition/schedules';

export const S140_COLORS = {
  week: {
    main: '#6876BE',
    text: '#3B4CA3',
    time: 'rgba(104, 118, 190, 0.1)',
    tint: '#F7F8FF',
  },
  treasures: {
    main: '#3C7F8B',
    text: '#2A6B77',
    tint: '#ECF6F8',
    time: 'rgba(60, 127, 139, 0.08)',
  },
  ministry: {
    main: '#C28200',
    text: '#956711',
    tint: '#FDF5E4',
    time: 'rgba(194, 130, 0, 0.08)',
  },
  living: {
    main: '#B82B10',
    text: '#942926',
    tint: '#FFF3F1',
    time: 'rgba(184, 43, 16, 0.08)',
  },
};

export type S140Classroom = {
  id: 'A' | 'B';
  name: string;
  counselor?: string;
  group?: string;
};

// aux first, so the main hall keeps the names column used everywhere else
export const getClassrooms = (
  meetingData: MidweekMeetingDataType,
  names: { main: string; aux: string }
): S140Classroom[] => {
  const main: S140Classroom = { id: 'A', name: names.main };

  if (!meetingData.aux_class) return [main];

  return [
    {
      id: 'B',
      name: names.aux,
      counselor: meetingData.chairman_B_name,
      group: meetingData.aux_room_fsg,
    },
    main,
  ];
};

// workbook sources end with the study reference in brackets, e.g. "Job 32:1-22 (th study 10)"
export const splitStudyReference = (src = '') => {
  const text = src.trim();
  const open = text.lastIndexOf('(');

  if (!text.endsWith(')') || open < 0) return { reference: '', text };

  return {
    reference: text.slice(open + 1, -1).trim(),
    text: text.slice(0, open).trim(),
  };
};

// by meeting date, not week start
export const groupByMonth = (data: MidweekMeetingDataType[]) =>
  data.reduce<MidweekMeetingDataType[][]>((months, meetingData) => {
    const monthOf = (week: MidweekMeetingDataType) =>
      (week.meeting_date || week.weekOf).slice(0, 7);
    const current = months.at(-1);

    if (current && monthOf(current[0]) === monthOf(meetingData)) {
      current.push(meetingData);
    } else {
      months.push([meetingData]);
    }

    return months;
  }, []);

// rough Inter widths at 7pt, enough to decide how two names share the cell
export const estimateWidth = (text: string, weight: number) =>
  text.length * (weight >= 500 ? 3.9 : 3.7);

// width for the first of two blocks: whoever fits in half leaves the rest to the other
export const splitWidth = (
  first: number,
  second: number,
  available: number
) => {
  const half = available / 2;

  if (first + second <= available || first <= half) return first;
  if (second <= half) return available - second;

  return half;
};
