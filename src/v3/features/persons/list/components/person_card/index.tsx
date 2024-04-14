import { Grid } from '@mui/material';
import Badge from '@components/badge';
import UserCard from '@components/user_card';
import { PersonCardType } from './index.types';
import usePersonCard from './usePersonCard';
import DeletePersonConfirm from '../person_delete';

const PersonCard = ({ person }: PersonCardType) => {
  const { badges, handleDeleteCancel, handleDelete, isDeleting, handleDeleteConfirm, handleOpenPerson } =
    usePersonCard(person);

  return (
    <Grid key={person.person_uid} item desktop={4} laptop={6} tablet={12} sx={{ width: '100%' }}>
      <DeletePersonConfirm open={isDeleting} onClose={handleDeleteCancel} onConfirm={handleDeleteConfirm} />

      <UserCard
        type="person"
        name={`${person.person_lastname.value} ${person.person_firstname.value}`}
        female={person.isFemale.value}
        onDelete={handleDelete}
        onClick={handleOpenPerson}
      >
        {badges.map((badge) => (
          <Badge key={badge.name} text={badge.name} color={badge.color} size="small" filled={false} />
        ))}
      </UserCard>
    </Grid>
  );
};

export default PersonCard;
