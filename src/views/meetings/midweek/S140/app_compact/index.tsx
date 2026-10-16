import { Page, View } from '@react-pdf/renderer';
import { Week } from '@definition/week_type';
import { MidweekMeetingDataType } from '@definition/schedules';
import { Document } from '@views/components';
import { useAppTranslation } from '@hooks/index';
import { applyRTL } from '@views/utils/pdf_utils';
import registerFonts from '@views/registerFonts';
import { S140Type } from '../shared/index.types';
import { groupByMonth } from '../shared/index.utils';
import S140Header from '../app_normal/S140Header';
import S140Week from './S140Week';
import styles, { Density } from './index.styles';

registerFonts();

// A4 height minus page padding, page header and a safety margin
const PAGE_CONTENT_HEIGHT = 842 - 40 - 22 - 16;

const DENSE: Density = {
  row: 9.25,
  section: 9.5,
  weekGap: 5,
  stackNames: false,
};
const ROOMY: Density = {
  row: 13,
  section: 13.5,
  weekGap: 16,
  stackNames: true,
};

const rowsInWeek = (meetingData: MidweekMeetingDataType) => {
  const ayf = [1, 2, 3, 4].filter(
    (index) => meetingData[`ayf_part${index}_type`]
  ).length;

  const lc =
    [1, 2, 3].filter((index) => meetingData[`lc_part${index}_src`]?.length)
      .length +
    (meetingData.week_type === Week.CO_VISIT ? 2 : 0) +
    Number(meetingData.cbs);

  return {
    sections:
      Number(meetingData.treasures || meetingData.students) +
      Number(meetingData.students) +
      Number(meetingData.living),
    rows:
      (meetingData.treasures ? 2 : 0) +
      Number(meetingData.students) +
      ayf +
      (meetingData.living ? lc : 0) +
      Number(meetingData.full),
    extraLines: meetingData.aux_class ? ayf : 0,
  };
};

const weekHeight = (meetingData: MidweekMeetingDataType, density: Density) => {
  if (meetingData.no_meeting) return 16 + density.weekGap;

  const { sections, rows, extraLines } = rowsInWeek(meetingData);

  return (
    density.row +
    2 +
    sections * (density.section + 0.75) +
    rows * density.row +
    (density.stackNames ? extraLines * 8.4 : 0) +
    density.weekGap +
    1.5
  );
};

const mix = (ratio: number, stackNames: boolean): Density => ({
  stackNames,
  row: DENSE.row + (ROOMY.row - DENSE.row) * ratio,
  section: DENSE.section + (ROOMY.section - DENSE.section) * ratio,
  weekGap: DENSE.weekGap + (ROOMY.weekGap - DENSE.weekGap) * ratio,
});

const pickDensity = (data: MidweekMeetingDataType[]) => {
  // stacked student/assistant names only while the page still fits
  for (const stackNames of [true, false]) {
    for (let ratio = 1; ratio >= 0; ratio -= 0.05) {
      const density = mix(ratio, stackNames);
      const height = data.reduce(
        (total, meetingData) => total + weekHeight(meetingData, density),
        0
      );

      if (height <= PAGE_CONTENT_HEIGHT) return density;
    }
  }

  return DENSE;
};

const TemplateS140AppCompact = ({ data, cong_name, lang }: S140Type) => {
  const { t } = useAppTranslation();

  const stylesSmart = applyRTL(styles, lang);

  return (
    <Document title={t('tr_midweekMeetingPrint')} lang={lang}>
      <Page size="A4" style={stylesSmart.page}>
        <S140Header cong_name={cong_name} lang={lang} />

        {groupByMonth(data).map((month, index) => {
          const density = pickDensity(month);

          return (
            <View key={month[0].weekOf} break={index > 0}>
              {month.map((meetingData) => (
                <S140Week
                  key={meetingData.weekOf}
                  meetingData={meetingData}
                  density={density}
                  lang={lang}
                />
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

export default TemplateS140AppCompact;
