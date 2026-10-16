import { Text, View } from '@react-pdf/renderer';
import { Week } from '@definition/week_type';
import { useAppTranslation } from '@hooks/index';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';
import IconCalendarClock from '@views/components/icons/IconCalendarClock';
import IconPart from '@views/components/icons/IconPart';
import IconStadium from '@views/components/icons/IconStadium';
import IconWine from '@views/components/icons/IconWine';
import { S140_COLORS } from './index.utils';

type S140NoMeetingType = {
  date: string;
  name: string;
  weekType: Week;
  iconSize: number;
  fontSize: number;
  padding: number;
  marginBottom: number;
  lang: string;
};

const TEXT = S140_COLORS.week.text;
const MUTED = '#8A90B8';
const OUTLINE = '#AEB6E0';

const EventIcon = ({ weekType, size }: { weekType: Week; size: number }) => {
  if (weekType === Week.ASSEMBLY || weekType === Week.CONVENTION) {
    return <IconStadium size={size} color={TEXT} />;
  }

  if (weekType === Week.MEMORIAL) {
    return <IconWine size={size} color={TEXT} />;
  }

  return <IconCalendarClock size={size} color={TEXT} />;
};

const S140NoMeeting = ({
  date,
  name,
  weekType,
  iconSize,
  fontSize,
  padding,
  marginBottom,
  lang,
}: S140NoMeetingType) => {
  const { t } = useAppTranslation();
  const rlm = isRTL(lang) ? '\u200f' : '';

  const text = {
    fontSize: `${fontSize}px`,
    maxLines: 1,
    textOverflow: 'ellipsis' as const,
  };

  return (
    <View
      style={applyRTL(
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: `${padding * 1.5}px`,
          padding: `${padding}px ${padding * 2}px`,
          marginBottom: `${marginBottom}px`,
          borderWidth: '0.75px',
          borderStyle: 'dashed',
          borderColor: OUTLINE,
          borderRadius: '4px',
        },
        lang
      )}
      wrap={false}
    >
      <IconPart size={iconSize} color={S140_COLORS.week.main} />
      <Text style={{ ...text, fontWeight: 600, color: TEXT }}>
        {rlm}
        {date}
      </Text>
      <Text style={{ ...text, color: OUTLINE }}>|</Text>
      <EventIcon weekType={weekType} size={iconSize} />
      <Text style={{ ...text, flex: 1, fontWeight: 600, color: TEXT }}>
        {rlm}
        {name}
      </Text>
      <Text style={{ ...text, fontSize: `${fontSize - 1}px`, color: MUTED }}>
        {rlm}
        {t('tr_noMeeting', { lng: lang })}
      </Text>
    </View>
  );
};

export default S140NoMeeting;
