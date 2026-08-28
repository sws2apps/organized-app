import { ComponentType } from 'react';
import { Text, View } from '@react-pdf/renderer';
import {
  IconAtHome,
  IconAudioMixer,
  IconComputerVideo,
  IconConference,
  IconDoor,
  IconDuties,
  IconHallOverseer,
  IconMicrophone,
  IconTalk,
} from '@views/components/icons';
import { IconProps } from '@views/components/icons/index.types';
import { DutiesCardIconType, DutiesCardProps } from './index.types';
import {
  CARD_HORIZONTAL_BORDER,
  CELL_DIVIDER_WIDTH,
  dateWidth,
  iconSize,
  lineCount,
  ROW_TEXT_PADDING,
} from './packDuties';
import styles, {
  CARD_RADIUS,
  DIVIDER_BORDER,
  SHADED_ROW_COLOR,
  TITLE_COLOR,
} from './index.styles';
import DutiesCardRow from './DutiesCardRow';

const DUTY_ICONS: Record<DutiesCardIconType, ComponentType<IconProps>> = {
  audio: IconAudioMixer,
  video: IconComputerVideo,
  audioVideo: IconComputerVideo,
  microphone: IconMicrophone,
  stage: IconTalk,
  entranceAttendant: IconDoor,
  auditoriumAttendant: IconHallOverseer,
  hospitality: IconAtHome,
  videoconferenceHost: IconConference,
  custom: IconDuties,
};

const DutiesCard = ({ card, width, fontSize }: DutiesCardProps) => {
  const Icon = DUTY_ICONS[card.icon];

  // columns share one line per position so paired rows keep the same height
  const lines = lineCount(card.columns);
  const cellWidth = (width - CARD_HORIZONTAL_BORDER) / card.columns.length;

  return (
    <View style={{ width }}>
      <View style={styles.cardTitleContainer}>
        <Icon size={iconSize(fontSize)} color={TITLE_COLOR} />
        <Text style={{ ...styles.cardTitle, fontSize }}>{card.name}</Text>
      </View>

      <View style={styles.cardLines}>
        {Array.from({ length: lines }, (_, index) => {
          // the shaded fill would square off the card without its own radius
          const last = index === lines - 1;

          const key =
            card.columns.map((column) => column[index]?.id).find(Boolean) ??
            String(index);

          return (
            <View
              key={key}
              style={{
                ...styles.cardLine,
                backgroundColor: index % 2 === 0 ? SHADED_ROW_COLOR : undefined,
                borderBottom: last ? 'none' : DIVIDER_BORDER,
                borderBottomLeftRadius: last ? CARD_RADIUS : 0,
                borderBottomRightRadius: last ? CARD_RADIUS : 0,
              }}
            >
              {card.columns.map((column, position) => (
                <DutiesCardRow
                  key={`${key}_${position}`}
                  row={column[index]}
                  fontSize={fontSize}
                  divided={position > 0}
                  groupGap={card.groupGap}
                  dividerWidth={
                    cellWidth -
                    dateWidth(fontSize) -
                    ROW_TEXT_PADDING -
                    (position > 0 ? CELL_DIVIDER_WIDTH : 0)
                  }
                />
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default DutiesCard;
