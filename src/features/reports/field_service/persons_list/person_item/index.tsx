import {
  IconCheckmarkCircleAlt,
  IconReportReceived,
  IconReportWaiting,
} from '@components/icons';
import { UserCard } from './index.styles';
import { PersonItemProps } from './index.types';
import usePersonItem from './usePersonItem';
import PersonDetails from '@features/persons/person_details';
import { Tooltip } from '@components/index';
import { useAppTranslation } from '@hooks/index';

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
        <Tooltip label={t('tr_verified')} delaySpeed={'fast'} use>
          <IconCheckmarkCircleAlt color="var(--accent-main)" />
        </Tooltip>
      )}

      {report_status === 'received' && (
        <Tooltip label={t('tr_pendingVerification')} delaySpeed={'fast'} use>
          <IconReportReceived color="var(--accent-main)" />
        </Tooltip>
      )}

      {report_status === 'not_received' && (
        <Tooltip label={t('tr_notSubmitted')} delaySpeed={'fast'} use>
          <IconReportWaiting color="var(--accent-main)" />
        </Tooltip>
      )}
    </UserCard>
  );
};

export default PersonItem;
