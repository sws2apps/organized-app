import { Box, Grid2 as Grid } from '@mui/material';
import PersonCard from '../person_card';
import PersonsSearchNoResult from '../search_no_result';
import useAllPersons from './useAllPersons';

const PersonsListAll = () => {
  const { persons } = useAllPersons();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {persons.length === 0 && <PersonsSearchNoResult />}

      {persons.length > 0 && (
        <Grid container spacing={2}>
          {persons.map((person) => (
            <PersonCard key={person.person_uid} person={person} />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PersonsListAll;
