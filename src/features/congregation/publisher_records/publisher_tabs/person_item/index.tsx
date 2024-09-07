import { IconArrowLink } from '@components/icons';
import { UserCard } from './index.styles';
import { PersonItemProps } from './index.types';
import usePersonItem from './usePersonItem';
import PersonDetails from '@features/persons/person_details';

const PersonItem = ({ person, month }: PersonItemProps) => {
  const { handleOpenPublisher } = usePersonItem(person);

  return (
    <UserCard onClick={handleOpenPublisher}>
      <PersonDetails person={person} month={month} />

      <IconArrowLink color="var(--black)" />
    </UserCard>
  );
};

export default PersonItem;
