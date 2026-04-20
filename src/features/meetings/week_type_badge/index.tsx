import { useAppTranslation } from '@hooks/index';
import { Week } from '@definition/week_type';
import { IconWavingHand } from '@components/icons';
import Badge from '@components/badge';

type WeekTypeBadgeProps = {
  weekType: number;
};

const WeekTypeBadge = ({ weekType }: WeekTypeBadgeProps) => {
  const { t } = useAppTranslation();

  if (weekType === Week.CO_VISIT) {
    return (
      <Badge
        text={t('tr_circuitOverseerWeek')}
        color="accent"
        size="medium"
        multiLine
        filled={false}
        icon={<IconWavingHand />}
        sx={{ width: 'fit-content' }}
      />
    );
  }

  if (weekType === Week.ASSEMBLY) {
    return (
      <Badge
        text={t('tr_assemblyWeek')}
        color="accent"
        size="medium"
        multiLine
        filled={false}
        sx={{ width: 'fit-content' }}
      />
    );
  }

  if (weekType === Week.CONVENTION) {
    return (
      <Badge
        text={t('tr_conventionWeek')}
        color="accent"
        size="medium"
        multiLine
        filled={false}
        sx={{ width: 'fit-content' }}
      />
    );
  }

  if (weekType === Week.MEMORIAL) {
    return (
      <Badge
        text={t('tr_memorialWeek')}
        color="accent"
        size="medium"
        multiLine
        filled={false}
        sx={{ width: 'fit-content' }}
      />
    );
  }

  if (weekType === Week.NO_MEETING) {
    return (
      <Badge
        text={t('tr_noMeetingWeek')}
        color="grey"
        size="medium"
        multiLine
        filled={false}
        sx={{ width: 'fit-content' }}
      />
    );
  }

  return null;
};

export default WeekTypeBadge;
