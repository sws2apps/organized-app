import { useAppTranslation } from '@hooks/index';
import AssignmentBadge from '../assignment_badge';
import Badge from '@components/badge';
import WeekTypeBadge from '@features/meetings/week_type_badge';

type MeetingSectionBadgesProps = {
  myAssignmentsTotal: number;
  lastUpdated: string;
  weekType: number;
};

const MeetingSectionBadges = ({
  myAssignmentsTotal,
  lastUpdated,
  weekType,
}: MeetingSectionBadgesProps) => {
  const { t } = useAppTranslation();

  return (
    <>
      {myAssignmentsTotal > 0 && (
        <AssignmentBadge count={myAssignmentsTotal} />
      )}

      {lastUpdated && (
        <Badge
          text={t('tr_lastUpdated', { date: lastUpdated })}
          color="grey"
          size="small"
          filled={false}
          className="label-small-regular"
        />
      )}

      <WeekTypeBadge weekType={weekType} />
    </>
  );
};

export default MeetingSectionBadges;
