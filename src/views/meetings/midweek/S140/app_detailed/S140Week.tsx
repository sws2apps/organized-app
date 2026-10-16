import { Fragment, ReactNode } from 'react';
import { View } from '@react-pdf/renderer';
import { Week } from '@definition/week_type';
import { MidweekMeetingDataType } from '@definition/schedules';
import { useAppTranslation } from '@hooks/index';
import { applyRTL } from '@views/utils/pdf_utils';
import IconDiamond from '@views/components/icons/IconDiamond';
import IconLiving from '@views/components/icons/IconLiving';
import IconMinistry from '@views/components/icons/IconMinistry';
import {
  S140_COLORS,
  S140Classroom,
  getClassrooms,
  splitStudyReference,
} from '../shared/index.utils';
import { S140RowType } from './index.types';
import S140Row, { S140SongTitle } from './S140Row';
import S140SectionBar from './S140SectionBar';
import S140WeekHeader from './S140WeekHeader';
import S140NoMeeting from '../shared/S140NoMeeting';
import styles from './index.styles';

type RowData = Omit<
  S140RowType,
  'timeColor' | 'timeBackground' | 'backgroundColor' | 'lang'
> & { id: string };

type SectionData = {
  key: string;
  color: { text: string; time: string; tint?: string; main?: string };
  titleColor: string;
  bar?: ReactNode;
  rows: RowData[];
};

type Translate = (key: string) => string;

const compact = (rows: (RowData | false)[]) =>
  rows.filter(Boolean) as RowData[];

const openingRows = (meetingData: MidweekMeetingDataType, tr: Translate) => {
  const { full, timing } = meetingData;

  return compact([
    full && {
      id: 'opening_song',
      time: timing.pgm_start,
      titleNode: (
        <S140SongTitle
          song={meetingData.song_first}
          title={meetingData.song_first_title}
        />
      ),
      labels: [`${tr('tr_prayer')}:`],
      names: { primary: meetingData.opening_prayer_name },
    },
    {
      id: 'opening_comments',
      time: full ? timing.opening_comments : undefined,
      title: full ? tr('tr_openingComments') : undefined,
      labels: [`${tr('tr_chairman')}:`],
      names: { primary: meetingData.chairman_A_name },
    },
  ]);
};

const treasuresRows = (
  meetingData: MidweekMeetingDataType,
  tr: Translate,
  classrooms: S140Classroom[]
) => {
  const { timing } = meetingData;
  const reading = splitStudyReference(meetingData.tgw_bible_reading_desc);
  const multiClass = classrooms.length > 1;

  return compact([
    meetingData.treasures && {
      id: 'tgw_talk',
      time: timing.tgw_talk,
      title: meetingData.tgw_talk_src,
      duration: meetingData.tgw_talk_time,
      names: { primary: meetingData.tgw_talk_name },
    },
    meetingData.treasures && {
      id: 'tgw_gems',
      time: timing.tgw_gems,
      title: meetingData.tgw_gems_src,
      duration: meetingData.tgw_gems_time,
      names: { primary: meetingData.tgw_gems_name },
    },
    meetingData.students && {
      id: 'tgw_bible_reading',
      time: timing.tgw_bible_reading,
      title: meetingData.tgw_bible_reading_src,
      duration: `4 ${tr('tr_minLabel')}`,
      reference: reading.reference,
      text: reading.text,
      labels: [`${tr('tr_student')}:`],
      names: { primary: meetingData.tgw_bible_reading_A_name },
      classrooms: multiClass ? classrooms : undefined,
      classNames: multiClass
        ? classrooms.map((classroom) => ({
            id: classroom.id,
            primary: meetingData[`tgw_bible_reading_${classroom.id}_name`],
          }))
        : undefined,
    },
  ]);
};

const ministryRows = (
  meetingData: MidweekMeetingDataType,
  tr: Translate,
  classrooms: S140Classroom[]
) =>
  [1, 2, 3, 4]
    .filter((index) => meetingData[`ayf_part${index}_type`])
    .map((index): RowData => {
      const part = `ayf_part${index}`;
      const src = splitStudyReference(meetingData[`${part}_src`]);
      const label: string = meetingData[`${part}_label`] ?? '';
      const labels = label.length ? [`${tr('tr_student')}:`] : [];

      if (/[\n/]/.test(label)) labels.push(`${tr('tr_assistant')}:`);

      const cell = (id: string) => ({
        id,
        primary: meetingData[`${part}_${id}_student_name`],
        secondary: meetingData[`${part}_${id}_assistant_name`],
      });

      return {
        id: part,
        time: meetingData.timing[part],
        title: meetingData[`${part}_type_name`],
        duration: meetingData[`${part}_time`],
        reference: src.reference,
        text: src.text,
        labels,
        names: cell('A'),
        classNames:
          classrooms.length > 1
            ? classrooms.map((classroom) => cell(classroom.id))
            : undefined,
      };
    });

const livingRows = (meetingData: MidweekMeetingDataType, tr: Translate) => {
  const { full, timing } = meetingData;
  const cbsLabels = [`${tr('tr_cbsConductor')}:`];

  if (meetingData.lc_cbs_reader_name) cbsLabels.push(`${tr('tr_cbsReader')}:`);

  return compact([
    full && {
      id: 'middle_song',
      time: timing.lc_middle_song,
      titleNode: (
        <S140SongTitle
          song={meetingData.lc_middle_song}
          title={meetingData.lc_middle_song_title}
        />
      ),
    },
    ...[1, 2, 3]
      .filter((index) => meetingData[`lc_part${index}_src`]?.length)
      .map((index) => ({
        id: `lc_part${index}`,
        time: timing[`lc_part${index}`],
        title: meetingData[`lc_part${index}_src`],
        duration: meetingData[`lc_part${index}_time`],
        names: { primary: meetingData[`lc_part${index}_name`] },
      })),
    meetingData.cbs && {
      id: 'cbs',
      time: timing.cbs,
      title: meetingData.lc_cbs_title,
      duration: meetingData.lc_cbs_time,
      reference: meetingData.lc_cbs_src,
      labels: cbsLabels,
      names: {
        primary: meetingData.lc_cbs_conductor_name,
        secondary: meetingData.lc_cbs_reader_name,
      },
    },
    full && {
      id: 'concluding_comments',
      time: timing.concluding_comments,
      title: tr('tr_concludingComments'),
      titleColor: '#222222',
    },
    meetingData.week_type === Week.CO_VISIT && {
      id: 'co_talk',
      time: timing.co_talk,
      title: meetingData.lc_co_talk,
      names: { primary: meetingData.co_name },
    },
    full && {
      id: 'closing_song',
      time: timing.pgm_end,
      titleNode: (
        <S140SongTitle
          song={meetingData.lc_concluding_song}
          title={meetingData.lc_concluding_song_title}
        />
      ),
      labels: [`${tr('tr_prayer')}:`],
      names: { primary: meetingData.lc_concluding_prayer },
    },
  ]);
};

const S140Week = ({
  meetingData,
  lang,
}: {
  meetingData: MidweekMeetingDataType;
  lang: string;
}) => {
  const { t } = useAppTranslation();
  const stylesSmart = applyRTL(styles, lang);

  if (meetingData.no_meeting) {
    return (
      <View style={stylesSmart.weekContainer}>
        <S140NoMeeting
          date={meetingData.schedule_title}
          name={meetingData.week_type_name}
          weekType={meetingData.week_type}
          iconSize={13}
          fontSize={10}
          padding={6}
          marginBottom={0}
          lang={lang}
        />
      </View>
    );
  }

  const tr: Translate = (key) => t(key, { lng: lang });
  const { week, treasures, ministry, living } = S140_COLORS;

  const classrooms = getClassrooms(meetingData, {
    main: tr('tr_mainHall'),
    aux: tr('tr_auxClass'),
  });

  const sectionBar = (icon: ReactNode, title: string, color: string) => (
    <S140SectionBar icon={icon} section={tr(title)} color={color} lang={lang} />
  );

  const sections: SectionData[] = [
    {
      key: 'opening',
      color: week,
      titleColor: '#222222',
      rows: openingRows(meetingData, tr),
    },
    (meetingData.treasures || meetingData.students) && {
      key: 'treasures',
      color: treasures,
      titleColor: treasures.text,
      bar: sectionBar(<IconDiamond />, 'tr_treasuresPart', treasures.main),
      rows: treasuresRows(meetingData, tr, classrooms),
    },
    meetingData.students && {
      key: 'ministry',
      color: ministry,
      titleColor: ministry.text,
      bar: sectionBar(
        <IconMinistry />,
        'tr_applyFieldMinistryPart',
        ministry.main
      ),
      rows: ministryRows(meetingData, tr, classrooms),
    },
    meetingData.living && {
      key: 'living',
      color: living,
      titleColor: living.text,
      bar: sectionBar(<IconLiving />, 'tr_livingPart', living.main),
      rows: livingRows(meetingData, tr),
    },
  ].filter(Boolean) as SectionData[];

  const lastRow = sections.at(-1)?.rows.at(-1);

  return (
    <View style={stylesSmart.weekContainer}>
      <S140WeekHeader
        title={meetingData.schedule_title}
        event={meetingData.week_type_name}
        lang={lang}
      />

      {sections.map((section) => (
        <Fragment key={section.key}>
          {section.bar}

          {section.rows.map((row, index) => (
            <S140Row
              key={row.id}
              timeColor={section.color.text}
              timeBackground={section.color.time}
              titleColor={section.titleColor}
              {...row}
              backgroundColor={index % 2 === 1 ? section.color.tint : undefined}
              last={row === lastRow}
              lang={lang}
            />
          ))}
        </Fragment>
      ))}
    </View>
  );
};

export default S140Week;
