import { Grid2 as Grid } from '@mui/material';
import { PersonCardType } from './index.types';
import { buildPersonFullname } from '@utils/common';
import usePersonCard from './usePersonCard';
import Badge from '@components/badge';
import DeletePersonConfirm from '../person_delete';
import UserCard from '@components/user_card';

const PersonCard = ({ person }: PersonCardType) => {
  const {
    badges,
    handleDeleteCancel,
    handleDelete,
    isDeleting,
    handleDeleteConfirm,
    handleOpenPerson,
    fullnameOption,
  } = usePersonCard(person);

  return (
    <Grid size={{ desktop: 4, laptop: 6, tablet: 12 }} sx={{ width: '100%' }}>
      <DeletePersonConfirm
        open={isDeleting}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <UserCard
        type="person"
        name={buildPersonFullname(
          person.person_data.person_lastname.value,
          person.person_data.person_firstname.value,
          fullnameOption
        )}
        female={person.person_data.female.value}
        onDelete={handleDelete}
        onClick={handleOpenPerson}
      >
        {badges.map((badge) => (
          <Badge
            key={badge.name}
            text={badge.name}
            color={badge.color}
            size="small"
            filled={false}
          />
        ))}
      </UserCard>
    </Grid>
  );
};

export default PersonCard;
