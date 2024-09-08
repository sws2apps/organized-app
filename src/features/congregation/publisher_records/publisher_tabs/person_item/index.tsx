import { IconArrowLink } from '@components/icons';
import { UserCard } from './index.styles';
import { PersonItemProps } from './index.types';
import usePersonItem from './usePersonItem';
import PersonDetails from '@features/persons/person_details';

const PersonItem = (props: PersonItemProps) => {
  const { handleOpenPublisher, month, person, badges } = usePersonItem(props);

  return (
    <UserCard onClick={handleOpenPublisher}>
      <PersonDetails person={person} month={month} badgesOverride={badges} />

      <IconArrowLink color="var(--black)" />
    </UserCard>
  );
};

export default PersonItem;
