import { ReactNode } from 'react';
import { Text, View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';
import { Week } from '@definition/week_type';
import { MidweekMeetingDataType } from '@definition/schedules';
import { useAppTranslation } from '@hooks/index';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';
import IconDiamond from '@views/components/icons/IconDiamond';
import IconLiving from '@views/components/icons/IconLiving';
import IconMinistry from '@views/components/icons/IconMinistry';
import IconPart from '@views/components/icons/IconPart';
import IconSong from '@views/components/icons/IconSong';
import { S140_COLORS } from '../shared/index.utils';
import S140NoMeeting from '../shared/S140NoMeeting';
import styles, { Density, MIDDLE_WIDTH, NAMES_WIDTH } from './index.styles';

type Names = { primary?: string; secondary?: string };

type Row = {
  time?: string;
  title?: ReactNode;
  duration?: string;
  color?: string;
  names?: Names;
  classNames?: [Names, Names];
  middle?: ReactNode;
};

type Section = {
  key: string;
  color: { main: string; text: string; time: string; tint: string };
  icon: ReactNode;
  title: string;
  middle?: ReactNode;
  name?: string;
  classHeader?: boolean;
  rows: Row[];
};

const CLASS_BORDER = `0.75px solid ${S140_COLORS.ministry.main}`;
const PAIR_GAP = 3;

// rough Inter widths at 7pt, enough to decide how two names share one cell
const estimateWidth = (text: string, weight: number) =>
  text.length * (weight >= 500 ? 3.9 : 3.7);

const S140Week = ({
  meetingData,
  density,
  lang,
}: {
  meetingData: MidweekMeetingDataType;
  density: Density;
  lang: string;
}) => {
  const { t } = useAppTranslation();
  const stylesSmart = applyRTL(styles, lang);
  const rlm = isRTL(lang) ? '‏' : '';

  const tr = (key: string) => t(key, { lng: lang });
  const prayerLabel = `${tr('tr_prayer')}:`;

  const { full, timing } = meetingData;
  const aux = meetingData.aux_class;
  const isCOVisit = meetingData.week_type === Week.CO_VISIT;

  if (meetingData.no_meeting) {
    return (
      <S140NoMeeting
        date={meetingData.schedule_title}
        name={meetingData.week_type_name}
        weekType={meetingData.week_type}
        iconSize={8}
        fontSize={7}
        padding={2.5}
        marginBottom={density.weekGap}
        lang={lang}
      />
    );
  }

  const song = (value: string) => (
    <View style={stylesSmart.song}>
      <IconSong size={7.5} />
      <Text style={stylesSmart.songText}>{value}</Text>
    </View>
  );

  const songMiddle = (value: string, withPrayer = true) => (
    <View style={stylesSmart.middle}>
      {song(value)}
      {withPrayer && (
        <Text style={stylesSmart.label}>
          {rlm}
          {prayerLabel}
        </Text>
      )}
    </View>
  );

  // two names share the cell; once they do not fit, each one keeps at least half of it
  const pair = ({ primary, secondary }: Names, width = NAMES_WIDTH - 4.5) => {
    const available = width - PAIR_GAP;
    const half = available / 2;
    const primaryWidth = estimateWidth(`${primary},`, 500);
    const secondaryWidth = estimateWidth(secondary ?? '', 400);

    if (!secondary || primaryWidth + secondaryWidth <= available) {
      return (
        <Text style={[stylesSmart.secondary, { flex: 1 }]}>
          {rlm}
          <Text style={stylesSmart.primary}>{primary}</Text>
          {secondary && `, ${secondary}`}
        </Text>
      );
    }

    let first = half;

    if (primaryWidth <= half) first = primaryWidth;
    else if (secondaryWidth <= half) first = available - secondaryWidth;

    const basis = (width: number): Style => ({
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: `${width}px`,
    });

    return (
      <>
        <Text style={[stylesSmart.primary, basis(first)]}>
          {rlm}
          {primary},
        </Text>
        <Text
          style={[
            stylesSmart.secondary,
            basis(available - first),
            applyRTL({ marginLeft: `${PAIR_GAP}px` }, lang),
          ]}
        >
          {rlm}
          {secondary}
        </Text>
      </>
    );
  };

  const classBorders = (
    index: number,
    edge: { top?: boolean; bottom?: boolean }
  ): Style =>
    applyRTL(
      {
        borderLeft: CLASS_BORDER,
        borderRight: index === 1 ? CLASS_BORDER : undefined,
        borderTop: edge.top ? CLASS_BORDER : undefined,
        borderBottom: edge.bottom ? CLASS_BORDER : undefined,
        borderTopLeftRadius: edge.top && index === 0 ? '3px' : 0,
        borderTopRightRadius: edge.top && index === 1 ? '3px' : 0,
      },
      lang
    );

  // auxiliary classroom first, so the main hall keeps the column every other name uses
  const classNamesFor = (part: string): [Names, Names] => [
    {
      primary: meetingData[`${part}_B_student_name`],
      secondary: meetingData[`${part}_B_assistant_name`],
    },
    {
      primary: meetingData[`${part}_A_student_name`],
      secondary: meetingData[`${part}_A_assistant_name`],
    },
  ];

  const sections: Section[] = [];

  if (meetingData.treasures || meetingData.students) {
    const rows: Row[] = [];

    if (meetingData.treasures) {
      rows.push(
        {
          time: timing.tgw_talk,
          title: meetingData.tgw_talk_src,
          duration: meetingData.tgw_talk_time,
          names: { primary: meetingData.tgw_talk_name },
        },
        {
          time: timing.tgw_gems,
          title: meetingData.tgw_gems_src,
          duration: meetingData.tgw_gems_time,
          names: { primary: meetingData.tgw_gems_name },
        }
      );
    }

    if (meetingData.students) {
      rows.push({
        time: timing.tgw_bible_reading,
        title: meetingData.tgw_bible_reading_src,
        duration: `4 ${tr('tr_minLabel')}`,
        names: { primary: meetingData.tgw_bible_reading_A_name },
        classNames: aux
          ? [
              { primary: meetingData.tgw_bible_reading_B_name },
              { primary: meetingData.tgw_bible_reading_A_name },
            ]
          : undefined,
      });
    }

    sections.push({
      key: 'treasures',
      color: S140_COLORS.treasures,
      icon: <IconDiamond size={7.5} />,
      title: tr('tr_treasuresPart'),
      middle: full ? songMiddle(meetingData.song_first) : undefined,
      name: full ? meetingData.opening_prayer_name : undefined,
      rows,
    });
  }

  if (meetingData.students) {
    sections.push({
      key: 'ministry',
      color: S140_COLORS.ministry,
      icon: <IconMinistry size={7.5} />,
      title: tr('tr_applyFieldMinistryPart'),
      classHeader: aux,
      rows: [1, 2, 3, 4]
        .filter((index) => meetingData[`ayf_part${index}_type`])
        .map((index) => {
          const part = `ayf_part${index}`;

          return {
            time: timing[part],
            title: meetingData[`${part}_type_name`],
            duration: meetingData[`${part}_time`],
            names: {
              primary: meetingData[`${part}_A_student_name`],
              secondary: meetingData[`${part}_A_assistant_name`],
            },
            classNames: aux ? classNamesFor(part) : undefined,
          };
        }),
    });
  }

  if (meetingData.living) {
    const rows: Row[] = [1, 2, 3]
      .filter((index) => meetingData[`lc_part${index}_src`]?.length)
      .map((index) => ({
        time: timing[`lc_part${index}`],
        title: meetingData[`lc_part${index}_src`],
        duration: meetingData[`lc_part${index}_time`],
        names: { primary: meetingData[`lc_part${index}_name`] },
      }));

    // the app orders a CO week as concluding comments, then the CO talk, then the closing song
    if (isCOVisit) {
      rows.push(
        {
          time: timing.concluding_comments,
          title: tr('tr_concludingComments'),
          color: '#222222',
          names: { primary: meetingData.chairman_A_name },
        },
        {
          time: timing.co_talk,
          title: meetingData.lc_co_talk,
          names: { primary: meetingData.co_name },
        }
      );
    }

    if (meetingData.cbs) {
      rows.push({
        time: timing.cbs,
        title: meetingData.lc_cbs_title,
        duration: meetingData.lc_cbs_time,
        names: {
          primary: meetingData.lc_cbs_conductor_name,
          secondary: meetingData.lc_cbs_reader_name,
        },
      });
    }

    sections.push({
      key: 'living',
      color: S140_COLORS.living,
      icon: <IconLiving size={7.5} />,
      title: tr('tr_livingPart'),
      middle: full ? songMiddle(meetingData.lc_middle_song, false) : undefined,
      rows,
    });
  }

  const auxRowsTotal = sections.reduce(
    (total, section) =>
      total + section.rows.filter((row) => row.classNames).length,
    0
  );
  let auxRowsSeen = 0;
  let blockStarted = false;

  const counselor = [meetingData.chairman_B_name, meetingData.aux_room_fsg]
    .filter(Boolean)
    .join(' · ');

  const hallTags = [
    t('tr_hallWithName', { lng: lang, name: 'B' }),
    t('tr_hallWithName', { lng: lang, name: 'A' }),
  ];

  const hallTag = (index: number) => (
    <Text style={[stylesSmart.classHeader, stylesSmart.hallTag]}>
      {rlm}
      {hallTags[index]}
    </Text>
  );

  return (
    <View
      style={[stylesSmart.card, { marginBottom: `${density.weekGap}px` }]}
      wrap={false}
    >
      <View style={[stylesSmart.header, { minHeight: `${density.row + 2}px` }]}>
        <View style={stylesSmart.iconCell}>
          <IconPart size={8.5} />
        </View>
        <Text style={stylesSmart.headerTitle}>
          {rlm}
          {meetingData.schedule_title}
          {meetingData.week_type_name && ` – ${meetingData.week_type_name}`}
        </Text>
        <Text style={stylesSmart.headerLabel}>
          {rlm}
          {tr('tr_chairman')}:
        </Text>
        <Text style={stylesSmart.headerName}>
          {meetingData.chairman_A_name}
        </Text>
      </View>

      {sections.map((section) => (
        <View key={section.key}>
          <View
            style={[
              stylesSmart.sectionRow,
              {
                borderBottomColor: section.color.main,
                minHeight: `${density.section}px`,
              },
            ]}
          >
            <View
              style={[
                stylesSmart.iconCell,
                stylesSmart.sectionIcon,
                { backgroundColor: section.color.main },
              ]}
            >
              {section.icon}
            </View>
            <Text
              style={[stylesSmart.sectionTitle, { color: section.color.text }]}
            >
              {rlm}
              {section.title}
            </Text>

            {section.classHeader ? (
              <View style={stylesSmart.classCells}>
                {(() => {
                  const opensBlock = !blockStarted;
                  blockStarted = true;

                  // the section header carries the hall tags and the auxiliary counselor
                  return hallTags.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        stylesSmart.classCell,
                        classBorders(index, { top: opensBlock }),
                      ]}
                    >
                      <View style={stylesSmart.lineRow}>
                        {index === 0 && counselor ? (
                          <Text
                            style={[
                              stylesSmart.classHeader,
                              stylesSmart.classCounselor,
                            ]}
                          >
                            {rlm}
                            {counselor}
                          </Text>
                        ) : (
                          <View style={{ flex: 1 }} />
                        )}
                        {hallTag(index)}
                      </View>
                    </View>
                  ));
                })()}
              </View>
            ) : (
              <>
                {section.middle ?? <View style={stylesSmart.middle} />}
                <View style={stylesSmart.names}>
                  <Text style={[stylesSmart.primary, { flex: 1 }]}>
                    {section.name}
                  </Text>
                </View>
              </>
            )}
          </View>

          {section.rows.map((row, index) => {
            const edge = row.classNames
              ? {
                  top: !blockStarted,
                  bottom: auxRowsSeen === auxRowsTotal - 1,
                }
              : {};

            if (row.classNames) {
              auxRowsSeen += 1;
              blockStarted = true;
            }

            const color = row.color ?? section.color.text;

            return (
              <View
                key={index}
                style={[
                  stylesSmart.row,
                  {
                    minHeight: `${density.row}px`,
                    backgroundColor:
                      index % 2 === 1 ? section.color.tint : undefined,
                  },
                  row.classNames ? { alignItems: 'stretch' } : {},
                ]}
                wrap={false}
              >
                <View
                  style={[
                    stylesSmart.iconCell,
                    { backgroundColor: section.color.time },
                  ]}
                >
                  <Text style={[stylesSmart.time, { color }]}>{row.time}</Text>
                </View>
                <Text style={[stylesSmart.title, { color }]}>
                  {rlm}
                  {row.title}
                  {row.duration && (
                    <Text style={stylesSmart.duration}>
                      {` (${row.duration})`}
                    </Text>
                  )}
                </Text>

                {row.classNames ? (
                  <View style={stylesSmart.classCells}>
                    {row.classNames.map((names, cellIndex) => (
                      <View
                        key={cellIndex}
                        style={[
                          stylesSmart.classCell,
                          classBorders(cellIndex, edge),
                        ]}
                      >
                        {density.stackNames ? (
                          <>
                            <View style={stylesSmart.lineRow}>
                              <Text style={[stylesSmart.primary, { flex: 1 }]}>
                                {rlm}
                                {names.primary}
                              </Text>
                            </View>
                            {names.secondary && (
                              <Text style={stylesSmart.secondary}>
                                {rlm}
                                {names.secondary}
                              </Text>
                            )}
                          </>
                        ) : (
                          <View style={stylesSmart.lineRow}>
                            {pair(names, (MIDDLE_WIDTH + NAMES_WIDTH) / 2 - 6)}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                ) : (
                  <>
                    {row.middle ?? <View style={stylesSmart.middle} />}
                    <View style={stylesSmart.names}>
                      {row.names && pair(row.names)}
                    </View>
                  </>
                )}
              </View>
            );
          })}
        </View>
      ))}

      {full && (
        <View
          style={[
            stylesSmart.row,
            stylesSmart.closing,
            { minHeight: `${density.row}px` },
          ]}
        >
          <View style={stylesSmart.iconCell}>
            <Text style={[stylesSmart.time, { color: '#222222' }]}>
              {isCOVisit ? timing.pgm_end : timing.concluding_comments}
            </Text>
          </View>
          <Text style={[stylesSmart.title, { color: '#222222' }]}>
            {rlm}
            {!isCOVisit && tr('tr_concludingComments')}
          </Text>
          {songMiddle(meetingData.lc_concluding_song)}
          <View style={stylesSmart.names}>
            <Text style={[stylesSmart.primary, { flex: 1 }]}>
              {meetingData.lc_concluding_prayer}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default S140Week;
