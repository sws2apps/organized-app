import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const CongregationPersonBasic = ({ person }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ minWidth: '300px', fontWeight: 'bold' }}>
        {person.username}
      </Typography>
      <Typography>{person.user_uid}</Typography>
    </Box>
  );
};

export default CongregationPersonBasic;
