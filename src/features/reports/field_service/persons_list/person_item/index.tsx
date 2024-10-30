import {
  IconCheckmarkCircleAlt,
  IconReportReceived,
  IconReportWaiting,
} from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { UserCard } from './index.styles';
import { PersonItemProps } from './index.types';
import usePersonItem from './usePersonItem';
import PersonDetails from '@features/persons/person_details';
import Tooltip from '@components/tooltip';

const PersonItem = (props: PersonItemProps) => {
  const { report_status, isSelected, handleToggleSelect, currentMonth } =
    usePersonItem(props);

  const { t } = useAppTranslation();

  return (
    <UserCard
      onClick={handleToggleSelect}
      sx={{
        borderColor: isSelected && 'var(--accent-main)',
        backgroundColor: isSelected && 'var(--accent-100)',
      }}
    >
      <PersonDetails person={props.person} month={currentMonth} />

      {report_status === 'confirmed' && (
        <Tooltip title={t('tr_verified')}>
          <IconCheckmarkCircleAlt color="var(--accent-main)" />
        </Tooltip>
      )}

      {report_status === 'received' && (
        <Tooltip title={t('tr_pendingVerification')}>
          <IconReportReceived color="var(--accent-main)" />
        </Tooltip>
      )}

      {report_status === 'not_received' && (
        <Tooltip title={t('tr_notSubmitted')}>
          <IconReportWaiting color="var(--accent-main)" />
        </Tooltip>
      )}
    </UserCard>
  );
};

export default PersonItem;
