import { Box, Grid } from '@mui/material';
import PersonCard from '../person_card';
import useAllPersons from './useAllPersons';

const PersonsListAll = () => {
  const { persons } = useAllPersons();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {persons.map((person) => (
          <PersonCard key={person.person_uid} person={person} />
        ))}
      </Grid>
    </Box>
  );
};

export default PersonsListAll;
