import { Box, Grid2 as Grid } from '@mui/material';
import PersonCard from '../person_card';
import useRecentPersons from './useRecentPersons';

const PersonsRecent = () => {
  const { persons } = useRecentPersons();

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

export default PersonsRecent;
