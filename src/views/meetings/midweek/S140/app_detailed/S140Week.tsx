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
>;

type SectionData = {
  key: string;
  color: { text: string; time: string; tint?: string; main?: string };
  titleColor: string;
  bar?: ReactNode;
  rows: RowData[];
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

  const tr = (key: string) => t(key, { lng: lang });
  const prayerLabel = `${tr('tr_prayer')}:`;

  const { full, timing } = meetingData;
  const isCOVisit = meetingData.week_type === Week.CO_VISIT;
  const { week, treasures, ministry, living } = S140_COLORS;

  const classrooms = getClassrooms(meetingData, {
    main: tr('tr_mainHall'),
    aux: tr('tr_auxClass'),
  });
  const multiClass = classrooms.length > 1;

  const sections: SectionData[] = [];

  sections.push({
    key: 'opening',
    color: week,
    titleColor: '#222222',
    rows: [
      full && {
        time: timing.pgm_start,
        titleNode: (
          <S140SongTitle
            song={meetingData.song_first}
            title={meetingData.song_first_title}
          />
        ),
        labels: [prayerLabel],
        names: { primary: meetingData.opening_prayer_name },
      },
      {
        time: full ? timing.opening_comments : undefined,
        title: full ? tr('tr_openingComments') : undefined,
        labels: [`${tr('tr_chairman')}:`],
        names: { primary: meetingData.chairman_A_name },
      },
    ].filter(Boolean) as RowData[],
  });

  if (meetingData.treasures || meetingData.students) {
    const reading = splitStudyReference(meetingData.tgw_bible_reading_desc);

    sections.push({
      key: 'treasures',
      color: treasures,
      titleColor: treasures.text,
      bar: (
        <S140SectionBar
          icon={<IconDiamond />}
          section={tr('tr_treasuresPart')}
          color={treasures.main}
          lang={lang}
        />
      ),
      rows: [
        meetingData.treasures && {
          time: timing.tgw_talk,
          title: meetingData.tgw_talk_src,
          duration: meetingData.tgw_talk_time,
          names: { primary: meetingData.tgw_talk_name },
        },
        meetingData.treasures && {
          time: timing.tgw_gems,
          title: meetingData.tgw_gems_src,
          duration: meetingData.tgw_gems_time,
          names: { primary: meetingData.tgw_gems_name },
        },
        meetingData.students && {
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
                primary: meetingData[`tgw_bible_reading_${classroom.id}_name`],
              }))
            : undefined,
        },
      ].filter(Boolean) as RowData[],
    });
  }

  if (meetingData.students) {
    sections.push({
      key: 'ministry',
      color: ministry,
      titleColor: ministry.text,
      bar: (
        <S140SectionBar
          icon={<IconMinistry />}
          section={tr('tr_applyFieldMinistryPart')}
          color={ministry.main}
          lang={lang}
        />
      ),
      rows: [1, 2, 3, 4]
        .filter((index) => meetingData[`ayf_part${index}_type`])
        .map((index) => {
          const part = `ayf_part${index}`;
          const src = splitStudyReference(meetingData[`${part}_src`]);
          const label: string = meetingData[`${part}_label`] ?? '';
          const withAssistant = /[\n/]/.test(label);

          const cell = (id: string) => ({
            primary: meetingData[`${part}_${id}_student_name`],
            secondary: meetingData[`${part}_${id}_assistant_name`],
          });

          return {
            time: timing[part],
            title: meetingData[`${part}_type_name`],
            duration: meetingData[`${part}_time`],
            reference: src.reference,
            text: src.text,
            labels: label.length
              ? [
                  `${tr('tr_student')}:`,
                  ...(withAssistant ? [`${tr('tr_assistant')}:`] : []),
                ]
              : [],
            names: cell('A'),
            classNames: multiClass
              ? classrooms.map((classroom) => cell(classroom.id))
              : undefined,
          };
        }),
    });
  }

  if (meetingData.living) {
    sections.push({
      key: 'living',
      color: living,
      titleColor: living.text,
      bar: (
        <S140SectionBar
          icon={<IconLiving />}
          section={tr('tr_livingPart')}
          color={living.main}
          lang={lang}
        />
      ),
      rows: [
        full && {
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
            time: timing[`lc_part${index}`],
            title: meetingData[`lc_part${index}_src`],
            duration: meetingData[`lc_part${index}_time`],
            names: { primary: meetingData[`lc_part${index}_name`] },
          })),
        meetingData.cbs && {
          time: timing.cbs,
          title: meetingData.lc_cbs_title,
          duration: meetingData.lc_cbs_time,
          reference: meetingData.lc_cbs_src,
          labels: [
            `${tr('tr_cbsConductor')}:`,
            ...(meetingData.lc_cbs_reader_name
              ? [`${tr('tr_cbsReader')}:`]
              : []),
          ],
          names: {
            primary: meetingData.lc_cbs_conductor_name,
            secondary: meetingData.lc_cbs_reader_name,
          },
        },
        full && {
          time: timing.concluding_comments,
          title: tr('tr_concludingComments'),
          titleColor: '#222222',
        },
        isCOVisit && {
          time: timing.co_talk,
          title: meetingData.lc_co_talk,
          names: { primary: meetingData.co_name },
        },
        full && {
          time: timing.pgm_end,
          titleNode: (
            <S140SongTitle
              song={meetingData.lc_concluding_song}
              title={meetingData.lc_concluding_song_title}
            />
          ),
          labels: [prayerLabel],
          names: { primary: meetingData.lc_concluding_prayer },
        },
      ].filter(Boolean) as RowData[],
    });
  }

  const lastSection = sections.at(-1);

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

  return (
    <View style={stylesSmart.weekContainer}>
      <S140WeekHeader
        title={meetingData.schedule_title}
        event={meetingData.no_meeting ? undefined : meetingData.week_type_name}
        lang={lang}
      />

      {!meetingData.no_meeting &&
        sections.map((section) => (
          <Fragment key={section.key}>
            {section.bar}

            {section.rows.map((row, index) => (
              <S140Row
                key={index}
                timeColor={section.color.text}
                timeBackground={section.color.time}
                titleColor={section.titleColor}
                {...row}
                backgroundColor={
                  index % 2 === 1 ? section.color.tint : undefined
                }
                last={
                  section === lastSection && index === section.rows.length - 1
                }
                lang={lang}
              />
            ))}
          </Fragment>
        ))}
    </View>
  );
};

export default S140Week;
