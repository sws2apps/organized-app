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
import { S140_COLORS, estimateWidth, splitWidth } from '../shared/index.utils';
import {
  livingParts,
  ministryParts,
  S140Names,
  S140Part,
  treasuresParts,
} from '../shared/parts';
import S140NoMeeting from '../shared/S140NoMeeting';
import S140NamePair from '../shared/S140NamePair';
import styles, { Density } from './index.styles';

type Column = {
  key: string;
  icon: ReactNode;
  section: string;
  color: { main: string; text: string };
  parts: S140Part[];
  before?: ReactNode;
  after?: ReactNode;
};

const DIVIDER = '0.5px solid #E6E8F0';
const AUX_TAG = 'AUX';
const AUX_TAG_WIDTH = 15;
const CELL_GAP = 4;

// a third of the card minus column padding and the time column
const NAMES_WIDTH = 555 / 3 - 12 - 22;

const needed = ({ primary, secondary }: S140Names) =>
  Math.max(
    estimateWidth(primary ?? '', 500),
    estimateWidth(secondary ?? '', 400)
  );

// one split per column keeps the AUX tags aligned from part to part
const mainHallWidth = (parts: S140Part[]) => {
  const withAux = parts.filter((part) => part.aux);

  if (withAux.length === 0) return 0;

  return splitWidth(
    Math.max(...withAux.map((part) => needed(part.names))) + CELL_GAP,
    Math.max(...withAux.map((part) => needed(part.aux ?? {}))) + AUX_TAG_WIDTH,
    NAMES_WIDTH
  );
};

const Song = ({ value, lang }: { value: string; lang: string }) => {
  const stylesSmart = applyRTL(styles, lang);

  return (
    <View style={stylesSmart.song}>
      <IconSong size={7} />
      <Text style={stylesSmart.songText}>{value}</Text>
    </View>
  );
};

const ClassCell = ({
  names,
  width,
  tag,
  lang,
}: {
  names: S140Names;
  width: number;
  tag?: string;
  lang: string;
}) => {
  const stylesSmart = applyRTL(styles, lang);
  const rlm = isRTL(lang) ? '\u200f' : '';
  const tagCell = (color?: string) =>
    tag && (
      <Text style={[stylesSmart.auxTag, color ? { color } : {}]}>{tag}</Text>
    );

  return (
    <View style={[stylesSmart.classCell, { flexGrow: 0, flexBasis: width }]}>
      <View style={stylesSmart.itemLine}>
        {tagCell()}
        <Text style={[stylesSmart.names, stylesSmart.primary]}>
          {rlm}
          {names.primary}
        </Text>
      </View>
      {names.secondary && (
        <View style={stylesSmart.itemLine}>
          {tagCell('transparent')}
          <Text style={stylesSmart.names}>
            {rlm}
            {names.secondary}
          </Text>
        </View>
      )}
    </View>
  );
};

const PartNames = ({
  part,
  mainWidth,
  lang,
}: {
  part: S140Part;
  mainWidth: number;
  lang: string;
}) => {
  const stylesSmart = applyRTL(styles, lang);

  if (!part.aux) {
    return (
      <S140NamePair
        {...part.names}
        width={NAMES_WIDTH}
        primaryStyle={{ ...stylesSmart.names, ...stylesSmart.primary }}
        secondaryStyle={stylesSmart.names}
        lang={lang}
      />
    );
  }

  return (
    <>
      <ClassCell names={part.names} width={mainWidth} lang={lang} />
      <ClassCell
        names={part.aux}
        width={NAMES_WIDTH - mainWidth}
        tag={AUX_TAG}
        lang={lang}
      />
    </>
  );
};

const PartItem = ({
  part,
  color,
  marginTop,
  mainWidth,
  lang,
}: {
  part: S140Part;
  color: string;
  marginTop: number;
  mainWidth: number;
  lang: string;
}) => {
  const stylesSmart = applyRTL(styles, lang);
  const rlm = isRTL(lang) ? '\u200f' : '';
  const textColor = part.dark ? '#222222' : color;

  return (
    <View style={[stylesSmart.item, { marginTop: `${marginTop}px` }]}>
      <View style={stylesSmart.itemLine}>
        <Text style={[stylesSmart.time, { color: textColor }]}>
          {part.time}
        </Text>
        <Text style={[stylesSmart.title, { color: textColor }]}>
          {rlm}
          {part.title}
          {part.duration && (
            <Text style={stylesSmart.duration}>{` (${part.duration})`}</Text>
          )}
        </Text>
      </View>
      <View style={stylesSmart.itemLine}>
        <Text style={stylesSmart.time}> </Text>
        <PartNames part={part} mainWidth={mainWidth} lang={lang} />
      </View>
    </View>
  );
};

const SectionColumn = ({
  column,
  first,
  density,
  lang,
}: {
  column: Column;
  first: boolean;
  density: Density;
  lang: string;
}) => {
  const stylesSmart = applyRTL(styles, lang);
  const rlm = isRTL(lang) ? '\u200f' : '';
  const divider: Style = first ? {} : applyRTL({ borderLeft: DIVIDER }, lang);
  const mainWidth = mainHallWidth(column.parts);

  return (
    <View
      style={[
        stylesSmart.column,
        divider,
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
        <Text style={[stylesSmart.sectionTitle, { color: column.color.text }]}>
          {rlm}
          {column.section}
        </Text>
      </View>

      {column.before && (
        <View style={{ marginBottom: `${density.itemGap}px` }}>
          {column.before}
        </View>
      )}

      {column.parts.map((part, index) => (
        <PartItem
          key={part.id}
          part={part}
          color={column.color.text}
          marginTop={index ? density.itemGap : 0}
          mainWidth={mainWidth}
          lang={lang}
        />
      ))}

      {column.after && (
        <View style={{ marginTop: `${density.itemGap + 1}px` }}>
          {column.after}
        </View>
      )}
    </View>
  );
};

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
  const rlm = isRTL(lang) ? '\u200f' : '';

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

  const tr = (key: string) => t(key, { lng: lang });
  const prayerLabel = `${tr('tr_prayer')}:`;
  const { full, timing } = meetingData;
  const isCOVisit = meetingData.week_type === Week.CO_VISIT;

  const counselor = [meetingData.chairman_B_name, meetingData.aux_room_fsg]
    .filter(Boolean)
    .join(' · ');

  const songLine = (time: string, song: string, prayer?: string) => (
    <View style={stylesSmart.itemLine}>
      <Text style={stylesSmart.time}>{time}</Text>
      <Song value={song} lang={lang} />
      {prayer !== undefined && (
        <>
          <Text style={stylesSmart.label}> {prayerLabel} </Text>
          <Text style={[stylesSmart.stripText, stylesSmart.primary]}>
            {prayer}
          </Text>
        </>
      )}
    </View>
  );

  const closing = (
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
      {songLine(
        isCOVisit ? timing.pgm_end : ' ',
        meetingData.lc_concluding_song,
        meetingData.lc_concluding_prayer ?? ''
      )}
    </View>
  );

  const columns: Column[] = [
    (meetingData.treasures || meetingData.students) && {
      key: 'treasures',
      icon: <IconDiamond size={7} />,
      section: tr('tr_treasuresPart'),
      color: S140_COLORS.treasures,
      parts: treasuresParts(meetingData, `4 ${tr('tr_minLabel')}`),
      before:
        full &&
        songLine(
          timing.pgm_start,
          meetingData.song_first,
          meetingData.opening_prayer_name ?? ''
        ),
    },
    meetingData.students && {
      key: 'ministry',
      icon: <IconMinistry size={7} />,
      section: tr('tr_applyFieldMinistryPart'),
      color: S140_COLORS.ministry,
      parts: ministryParts(meetingData),
      before: meetingData.aux_class && (
        <Text style={stylesSmart.counselor}>
          {rlm}
          <Text style={stylesSmart.primary}>{tr('tr_auxClass')}</Text>
          {counselor && `: ${counselor}`}
        </Text>
      ),
    },
    meetingData.living && {
      key: 'living',
      icon: <IconLiving size={7} />,
      section: tr('tr_livingPart'),
      color: S140_COLORS.living,
      parts: livingParts(meetingData, tr('tr_concludingComments')),
      before:
        full && songLine(timing.lc_middle_song, meetingData.lc_middle_song),
      after: full && closing,
    },
  ].filter(Boolean) as Column[];

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

      <View style={stylesSmart.columns}>
        {columns.map((column, index) => (
          <SectionColumn
            key={column.key}
            column={column}
            first={index === 0}
            density={density}
            lang={lang}
          />
        ))}
      </View>
    </View>
  );
};

export default S140Week;
