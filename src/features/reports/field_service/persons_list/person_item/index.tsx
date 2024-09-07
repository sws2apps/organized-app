import {
  IconCheckmarkCircleAlt,
  IconReportReceived,
  IconReportWaiting,
} from '@components/icons';
import { UserCard } from './index.styles';
import { PersonItemProps } from './index.types';
import usePersonItem from './usePersonItem';
import PersonDetails from '@features/persons/person_details';

const PersonItem = (props: PersonItemProps) => {
  const { report_status, isSelected, handleToggleSelect, currentMonth } =
    usePersonItem(props);

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
        <IconCheckmarkCircleAlt color="var(--accent-main)" />
      )}

      {report_status === 'received' && (
        <IconReportReceived color="var(--accent-main)" />
      )}

      {report_status === 'not_received' && (
        <IconReportWaiting color="var(--accent-main)" />
      )}
    </UserCard>
  );
};

export default PersonItem;
