import { MidweekMeetingDataType } from '@definition/schedules';
import { Week } from '@definition/week_type';
import { Density } from './index.styles';

// A4 height minus page padding, page header and a safety margin
const PAGE_CONTENT_HEIGHT = 842 - 40 - 22 - 16;
const LINE = 9.2;
const HEADER = 14;
const SECTION_HEADER = 15;

const MIN_GAP = 1;
const MAX_GAP = 6;

const densityFor = (gap: number): Density => ({
  itemGap: gap,
  padding: Math.min(Math.max(gap, 2), 5),
  weekGap: Math.min(Math.max(gap * 2.5, 4), 18),
  headerGap: Math.min(Math.max(gap * 0.6, 1.5), 3.5),
});

const estimateWeekHeight = (
  meetingData: MidweekMeetingDataType,
  density: Density
) => {
  if (meetingData.no_meeting) return HEADER + 14 + density.weekGap;

  const { full, students, treasures, living } = meetingData;
  const gap = density.itemGap;

  const column = (items: number, before: boolean, after = 0, lines = 2) =>
    (before ? LINE + gap : 0) +
    items * lines * LINE +
    Math.max(items - 1, 0) * gap +
    after;

  const ayfParts = [1, 2, 3, 4].filter(
    (index) => meetingData[`ayf_part${index}_type`]
  ).length;

  const lcParts =
    [1, 2, 3].filter((index) => meetingData[`lc_part${index}_src`]?.length)
      .length +
    Number(meetingData.week_type === Week.CO_VISIT) * 2 +
    Number(meetingData.cbs);

  const tallest = Math.max(
    treasures || students
      ? column((treasures ? 2 : 0) + Number(students), full)
      : 0,
    students
      ? column(
          ayfParts,
          meetingData.aux_class,
          0,
          meetingData.aux_class ? 3 : 2
        )
      : 0,
    living ? column(lcParts, full, full ? 2 * LINE + 4 + gap + 1 : 0) : 0
  );

  return (
    HEADER +
    SECTION_HEADER +
    density.headerGap +
    tallest +
    density.padding * 3 +
    density.weekGap
  );
};

const pickDensity = (data: MidweekMeetingDataType[]) => {
  for (let gap = MAX_GAP; gap > MIN_GAP; gap -= 0.25) {
    const density = densityFor(gap);

    const height = data.reduce(
      (total, meetingData) => total + estimateWeekHeight(meetingData, density),
      0
    );

    if (height <= PAGE_CONTENT_HEIGHT) return density;
  }

  return densityFor(MIN_GAP);
};

export default pickDensity;
