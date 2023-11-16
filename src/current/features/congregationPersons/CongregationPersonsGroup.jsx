import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CongregationPerson from './CongregationPerson';

const CongregationPersonsGroup = ({ congregationGroup }) => {
  const { persons, label } = congregationGroup;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
      <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Box>
        <Grid container spacing={2}>
          {persons.map((person) => (
            <Grid item key={person.id} xs={12} md={6} lg={4}>
              <CongregationPerson person={person} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CongregationPersonsGroup;
