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
import {
  livingParts,
  ministryParts,
  S140Names,
  S140Part,
  treasuresParts,
} from '../shared/parts';
import S140NoMeeting from '../shared/S140NoMeeting';
import S140NamePair from '../shared/S140NamePair';
import styles, { Density, MIDDLE_WIDTH, NAMES_WIDTH } from './index.styles';

type SectionColor = { main: string; text: string; time: string; tint: string };

type Section = {
  key: string;
  color: SectionColor;
  icon: ReactNode;
  title: string;
  middle?: ReactNode;
  name?: string;
  hallHeader?: boolean;
  parts: S140Part[];
};

type Edge = { top?: boolean; bottom?: boolean };

const CLASS_BORDER = `0.75px solid ${S140_COLORS.ministry.main}`;
const CLASS_CELL_WIDTH = (MIDDLE_WIDTH + NAMES_WIDTH) / 2 - 6;
const CLOSING_TIME = 'rgba(0, 0, 0, 0.05)';

// aux first, so the main hall keeps the names column used everywhere else
const HALLS = ['B', 'A'] as const;

const classBorders = (index: number, edge: Edge, lang: string): Style =>
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

const SongMiddle = ({
  song,
  prayerLabel,
  lang,
}: {
  song: string;
  prayerLabel?: string;
  lang: string;
}) => {
  const stylesSmart = applyRTL(styles, lang);
  const rlm = isRTL(lang) ? '\u200f' : '';

  return (
    <View style={stylesSmart.middle}>
      <View style={stylesSmart.song}>
        <IconSong size={7.5} />
        <Text style={stylesSmart.songText}>{song}</Text>
      </View>
      {prayerLabel && (
        <Text style={stylesSmart.label}>
          {rlm}
          {prayerLabel}
        </Text>
      )}
    </View>
  );
};

const NamePair = ({
  names,
  width,
  lang,
}: {
  names: S140Names;
  width: number;
  lang: string;
}) => {
  const stylesSmart = applyRTL(styles, lang);

  return (
    <S140NamePair
      {...names}
      width={width}
      primaryStyle={stylesSmart.primary}
      secondaryStyle={stylesSmart.secondary}
      lang={lang}
    />
  );
};

const HallHeader = ({
  counselor,
  opensBlock,
  lang,
}: {
  counselor: string;
  opensBlock: boolean;
  lang: string;
}) => {
  const { t } = useAppTranslation();
  const stylesSmart = applyRTL(styles, lang);
  const rlm = isRTL(lang) ? '\u200f' : '';

  return (
    <View style={stylesSmart.classCells}>
      {HALLS.map((hall, index) => (
        <View
          key={hall}
          style={[
            stylesSmart.classCell,
            classBorders(index, { top: opensBlock }, lang),
          ]}
        >
          <View style={stylesSmart.lineRow}>
            {hall === 'B' && counselor ? (
              <Text
                style={[stylesSmart.classHeader, stylesSmart.classCounselor]}
              >
                {rlm}
                {counselor}
              </Text>
            ) : (
              <View style={{ flex: 1 }} />
            )}
            <Text style={[stylesSmart.classHeader, stylesSmart.hallTag]}>
              {rlm}
              {t('tr_hallWithName', { lng: lang, name: hall })}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const ClassroomCells = ({
  part,
  edge,
  stackNames,
  lang,
}: {
  part: S140Part;
  edge: Edge;
  stackNames: boolean;
  lang: string;
}) => {
  const stylesSmart = applyRTL(styles, lang);
  const rlm = isRTL(lang) ? '\u200f' : '';
  const cells = { B: part.aux ?? {}, A: part.names };

  return (
    <View style={stylesSmart.classCells}>
      {HALLS.map((hall, index) => (
        <View
          key={hall}
          style={[stylesSmart.classCell, classBorders(index, edge, lang)]}
        >
          {stackNames ? (
            <>
              <Text style={stylesSmart.primary}>
                {rlm}
                {cells[hall].primary}
              </Text>
              {cells[hall].secondary && (
                <Text style={stylesSmart.secondary}>
                  {rlm}
                  {cells[hall].secondary}
                </Text>
              )}
            </>
          ) : (
            <View style={stylesSmart.lineRow}>
              <NamePair
                names={cells[hall]}
                width={CLASS_CELL_WIDTH}
                lang={lang}
              />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const PartRow = ({
  part,
  color,
  tinted,
  edge,
  density,
  lang,
}: {
  part: S140Part;
  color: SectionColor;
  tinted: boolean;
  edge: Edge;
  density: Density;
  lang: string;
}) => {
  const stylesSmart = applyRTL(styles, lang);
  const rlm = isRTL(lang) ? '\u200f' : '';
  const textColor = part.dark ? '#222222' : color.text;

  return (
    <View
      style={[
        stylesSmart.row,
        {
          minHeight: `${density.row}px`,
          backgroundColor: tinted ? color.tint : undefined,
        },
        part.aux ? { alignItems: 'stretch' } : {},
      ]}
      wrap={false}
    >
      <View style={[stylesSmart.iconCell, { backgroundColor: color.time }]}>
        <Text style={[stylesSmart.time, { color: textColor }]}>
          {part.time}
        </Text>
      </View>
      <Text style={[stylesSmart.title, { color: textColor }]}>
        {rlm}
        {part.title}
        {part.duration && (
          <Text style={stylesSmart.duration}>{` (${part.duration})`}</Text>
        )}
      </Text>

      {part.aux ? (
        <ClassroomCells
          part={part}
          edge={edge}
          stackNames={density.stackNames}
          lang={lang}
        />
      ) : (
        <>
          <View style={stylesSmart.middle} />
          <View style={stylesSmart.names}>
            <NamePair
              names={part.names}
              width={NAMES_WIDTH - 4.5}
              lang={lang}
            />
          </View>
        </>
      )}
    </View>
  );
};

const SectionHeader = ({
  section,
  counselor,
  opensBlock,
  density,
  lang,
}: {
  section: Section;
  counselor: string;
  opensBlock: boolean;
  density: Density;
  lang: string;
}) => {
  const stylesSmart = applyRTL(styles, lang);
  const rlm = isRTL(lang) ? '\u200f' : '';

  return (
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
      <Text style={[stylesSmart.sectionTitle, { color: section.color.text }]}>
        {rlm}
        {section.title}
      </Text>

      {section.hallHeader ? (
        <HallHeader counselor={counselor} opensBlock={opensBlock} lang={lang} />
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
  );
};

const ClosingRow = ({
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
  const isCOVisit = meetingData.week_type === Week.CO_VISIT;
  const { timing } = meetingData;

  return (
    <View
      style={[
        stylesSmart.row,
        stylesSmart.closing,
        { minHeight: `${density.row}px` },
      ]}
    >
      <View
        style={[
          stylesSmart.iconCell,
          applyRTL(
            {
              backgroundColor: CLOSING_TIME,
              borderBottomLeftRadius: '3.25px',
            },
            lang
          ),
        ]}
      >
        <Text style={[stylesSmart.time, { color: '#222222' }]}>
          {isCOVisit ? timing.pgm_end : timing.concluding_comments}
        </Text>
      </View>
      <Text style={[stylesSmart.title, { color: '#222222' }]}>
        {rlm}
        {!isCOVisit && t('tr_concludingComments', { lng: lang })}
      </Text>
      <SongMiddle
        song={meetingData.lc_concluding_song}
        prayerLabel={`${t('tr_prayer', { lng: lang })}:`}
        lang={lang}
      />
      <View style={stylesSmart.names}>
        <Text style={[stylesSmart.primary, { flex: 1 }]}>
          {meetingData.lc_concluding_prayer}
        </Text>
      </View>
    </View>
  );
};

const buildSections = (
  meetingData: MidweekMeetingDataType,
  tr: (key: string) => string,
  lang: string
) => {
  const { full } = meetingData;

  const sections: (Section | false)[] = [
    (meetingData.treasures || meetingData.students) && {
      key: 'treasures',
      color: S140_COLORS.treasures,
      icon: <IconDiamond size={7.5} />,
      title: tr('tr_treasuresPart'),
      middle: full && (
        <SongMiddle
          song={meetingData.song_first}
          prayerLabel={`${tr('tr_prayer')}:`}
          lang={lang}
        />
      ),
      name: full ? meetingData.opening_prayer_name : undefined,
      parts: treasuresParts(meetingData, `4 ${tr('tr_minLabel')}`),
    },
    meetingData.students && {
      key: 'ministry',
      color: S140_COLORS.ministry,
      icon: <IconMinistry size={7.5} />,
      title: tr('tr_applyFieldMinistryPart'),
      hallHeader: meetingData.aux_class,
      parts: ministryParts(meetingData),
    },
    meetingData.living && {
      key: 'living',
      color: S140_COLORS.living,
      icon: <IconLiving size={7.5} />,
      title: tr('tr_livingPart'),
      middle: full && (
        <SongMiddle song={meetingData.lc_middle_song} lang={lang} />
      ),
      parts: livingParts(meetingData, tr('tr_concludingComments')),
    },
  ];

  return sections.filter(Boolean) as Section[];
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
  const sections = buildSections(meetingData, tr, lang);

  const auxParts = sections.flatMap((section) =>
    section.parts.filter((part) => part.aux).map((part) => part.id)
  );
  const auxBeforeHeader = sections.some(
    (section) => !section.hallHeader && section.parts.some((part) => part.aux)
  );
  const edgeFor = (part: S140Part): Edge => ({
    top: auxBeforeHeader && part.id === auxParts[0],
    bottom: part.id === auxParts.at(-1),
  });

  const counselor = [meetingData.chairman_B_name, meetingData.aux_room_fsg]
    .filter(Boolean)
    .join(' · ');

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
          <SectionHeader
            section={section}
            counselor={counselor}
            opensBlock={!auxBeforeHeader}
            density={density}
            lang={lang}
          />
          {section.parts.map((part, index) => (
            <PartRow
              key={part.id}
              part={part}
              color={section.color}
              tinted={index % 2 === 1}
              edge={edgeFor(part)}
              density={density}
              lang={lang}
            />
          ))}
        </View>
      ))}

      {meetingData.full && (
        <ClosingRow meetingData={meetingData} density={density} lang={lang} />
      )}
    </View>
  );
};

export default S140Week;
