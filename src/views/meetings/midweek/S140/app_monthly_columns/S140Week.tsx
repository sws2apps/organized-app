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
import styles, { Density } from './index.styles';
import S140NoMeeting from '../shared/S140NoMeeting';
import S140NamePair from '../shared/S140NamePair';

type Names = { primary?: string; secondary?: string };

type Item = {
  time?: string;
  title?: string;
  duration?: string;
  names: Names;
  aux?: Names;
  color?: string;
};

type Column = {
  key: string;
  icon: ReactNode;
  section: string;
  color: { main: string; text: string };
  items: Item[];
  before?: ReactNode;
  after?: ReactNode;
};

const DIVIDER = '0.5px solid #E6E8F0';

// a third of the card minus column padding and the time column
const NAMES_WIDTH = 555 / 3 - 12 - 22;

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

  const song = (value: string) => (
    <View style={stylesSmart.song}>
      <IconSong size={7} />
      <Text style={stylesSmart.songText}>{value}</Text>
    </View>
  );

  const classCell = (names: Names, tag?: string) => (
    <View style={stylesSmart.classCell}>
      <View style={stylesSmart.itemLine}>
        {tag && <Text style={stylesSmart.auxTag}>{tag}</Text>}
        <Text style={[stylesSmart.names, stylesSmart.primary]}>
          {rlm}
          {names.primary}
        </Text>
      </View>
      {names.secondary && (
        <View style={stylesSmart.itemLine}>
          {tag && (
            <Text style={[stylesSmart.auxTag, { color: 'transparent' }]}>
              {tag}
            </Text>
          )}
          <Text style={stylesSmart.names}>
            {rlm}
            {names.secondary}
          </Text>
        </View>
      )}
    </View>
  );

  const nameLine = (names: Names, auxNames?: Names) => (
    <View style={stylesSmart.itemLine}>
      <Text style={stylesSmart.time}> </Text>
      {auxNames ? (
        <>
          {classCell(names)}
          {classCell(auxNames, 'AUX')}
        </>
      ) : (
        <S140NamePair
          {...names}
          width={NAMES_WIDTH}
          primaryStyle={{ ...stylesSmart.names, ...stylesSmart.primary }}
          secondaryStyle={stylesSmart.names}
          lang={lang}
        />
      )}
    </View>
  );

  const columns: Column[] = [];

  if (meetingData.treasures || meetingData.students) {
    const items: Item[] = [];

    if (meetingData.treasures) {
      items.push(
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
      items.push({
        time: timing.tgw_bible_reading,
        title: meetingData.tgw_bible_reading_src,
        duration: `4 ${tr('tr_minLabel')}`,
        names: { primary: meetingData.tgw_bible_reading_A_name },
        aux: aux
          ? { primary: meetingData.tgw_bible_reading_B_name }
          : undefined,
      });
    }

    columns.push({
      key: 'treasures',
      icon: <IconDiamond size={7} />,
      section: tr('tr_treasuresPart'),
      color: S140_COLORS.treasures,
      items,
      before: full && (
        <View style={stylesSmart.itemLine}>
          <Text style={stylesSmart.time}>{timing.pgm_start}</Text>
          {song(meetingData.song_first)}
          <Text style={stylesSmart.label}> {prayerLabel} </Text>
          <Text style={[stylesSmart.stripText, stylesSmart.primary]}>
            {meetingData.opening_prayer_name}
          </Text>
        </View>
      ),
    });
  }

  if (meetingData.students) {
    const counselor = [meetingData.chairman_B_name, meetingData.aux_room_fsg]
      .filter(Boolean)
      .join(' · ');

    columns.push({
      key: 'ministry',
      icon: <IconMinistry size={7} />,
      section: tr('tr_applyFieldMinistryPart'),
      color: S140_COLORS.ministry,
      items: [1, 2, 3, 4]
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
            aux: aux
              ? {
                  primary: meetingData[`${part}_B_student_name`],
                  secondary: meetingData[`${part}_B_assistant_name`],
                }
              : undefined,
          };
        }),
      before: aux && (
        <Text style={stylesSmart.counselor}>
          {rlm}
          <Text style={stylesSmart.primary}>{tr('tr_auxClass')}</Text>
          {counselor && `: ${counselor}`}
        </Text>
      ),
    });
  }

  if (meetingData.living) {
    const items: Item[] = [1, 2, 3]
      .filter((index) => meetingData[`lc_part${index}_src`]?.length)
      .map((index) => ({
        time: timing[`lc_part${index}`],
        title: meetingData[`lc_part${index}_src`],
        duration: meetingData[`lc_part${index}_time`],
        names: { primary: meetingData[`lc_part${index}_name`] },
      }));

    // matches the app: concluding comments come before the CO talk
    if (isCOVisit) {
      items.push({
        time: timing.concluding_comments,
        title: tr('tr_concludingComments'),
        names: { primary: meetingData.chairman_A_name },
        color: '#222222',
      });
      items.push({
        time: timing.co_talk,
        title: meetingData.lc_co_talk,
        names: { primary: meetingData.co_name },
      });
    }

    if (meetingData.cbs) {
      items.push({
        time: timing.cbs,
        title: meetingData.lc_cbs_title,
        duration: meetingData.lc_cbs_time,
        names: {
          primary: meetingData.lc_cbs_conductor_name,
          secondary: meetingData.lc_cbs_reader_name,
        },
      });
    }

    columns.push({
      key: 'living',
      icon: <IconLiving size={7} />,
      section: tr('tr_livingPart'),
      color: S140_COLORS.living,
      items,
      before: full && (
        <View style={stylesSmart.itemLine}>
          <Text style={stylesSmart.time}>{timing.lc_middle_song}</Text>
          {song(meetingData.lc_middle_song)}
        </View>
      ),
      after: full && (
        <View style={stylesSmart.closing}>
          {!isCOVisit && (
            <View style={stylesSmart.itemLine}>
              <Text style={stylesSmart.time}>{timing.concluding_comments}</Text>
              <Text style={[stylesSmart.stripText, stylesSmart.primary]}>
                {rlm}
                {tr('tr_concludingComments')}
              </Text>
            </View>
          )}
          <View style={stylesSmart.itemLine}>
            <Text style={stylesSmart.time}>
              {isCOVisit ? timing.pgm_end : ' '}
            </Text>
            {song(meetingData.lc_concluding_song)}
            <Text style={stylesSmart.label}> {prayerLabel} </Text>
            <Text style={[stylesSmart.stripText, stylesSmart.primary]}>
              {meetingData.lc_concluding_prayer}
            </Text>
          </View>
        </View>
      ),
    });
  }

  const cellStyle = (base: Style, index: number): Style[] => [
    base,
    index > 0 ? applyRTL({ borderLeft: DIVIDER }, lang) : {},
  ];

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

  return (
    <View
      style={[stylesSmart.card, { marginBottom: `${density.weekGap}px` }]}
      wrap={false}
    >
      <View style={stylesSmart.header}>
        <IconPart size={9} />
        <Text style={stylesSmart.headerTitle}>
          {rlm}
          {meetingData.schedule_title}
          {!meetingData.no_meeting &&
            meetingData.week_type_name &&
            ` – ${meetingData.week_type_name}`}
        </Text>
        {!meetingData.no_meeting && (
          <>
            <Text style={stylesSmart.headerLabel}>
              {rlm}
              {tr('tr_chairman')}:
            </Text>
            <Text style={stylesSmart.headerName}>
              {meetingData.chairman_A_name}
            </Text>
          </>
        )}
      </View>

      {!meetingData.no_meeting && (
        <>
          <View style={stylesSmart.columns}>
            {columns.map((column, index) => (
              <View
                key={column.key}
                style={[
                  ...cellStyle(stylesSmart.column, index),
                  { paddingVertical: `${density.padding}px` },
                ]}
              >
                <View
                  style={[
                    stylesSmart.sectionHeader,
                    {
                      borderBottomColor: column.color.main,
                      paddingBottom: `${density.headerGap}px`,
                      marginBottom: `${density.padding}px`,
                    },
                  ]}
                >
                  <View
                    style={[
                      stylesSmart.sectionIcon,
                      { backgroundColor: column.color.main },
                    ]}
                  >
                    {column.icon}
                  </View>
                  <Text
                    style={[
                      stylesSmart.sectionTitle,
                      { color: column.color.text },
                    ]}
                  >
                    {rlm}
                    {column.section}
                  </Text>
                </View>

                {column.before && (
                  <View style={{ marginBottom: `${density.itemGap}px` }}>
                    {column.before}
                  </View>
                )}

                {column.items.map((item, itemIndex) => (
                  <View
                    key={itemIndex}
                    style={[
                      stylesSmart.item,
                      { marginTop: itemIndex ? `${density.itemGap}px` : 0 },
                    ]}
                  >
                    <View style={stylesSmart.itemLine}>
                      <Text
                        style={[
                          stylesSmart.time,
                          { color: item.color ?? column.color.text },
                        ]}
                      >
                        {item.time}
                      </Text>
                      <Text
                        style={[
                          stylesSmart.title,
                          { color: item.color ?? column.color.text },
                        ]}
                      >
                        {rlm}
                        {item.title}
                        {item.duration && (
                          <Text style={stylesSmart.duration}>
                            {` (${item.duration})`}
                          </Text>
                        )}
                      </Text>
                    </View>
                    {nameLine(item.names, item.aux)}
                  </View>
                ))}

                {column.after && (
                  <View style={{ marginTop: `${density.itemGap + 1}px` }}>
                    {column.after}
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default S140Week;
