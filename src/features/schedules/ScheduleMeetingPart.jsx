import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ScheduleMeetingPart = ({ type, part }) => {
  return (
    <Box
      sx={{
        maxWidth: '100%',
        minWidth: '320px',
        borderRadius: '10px',
        padding: '0 10px',
        color: 'white',
        margin: '20px 0',
      }}
      className={type}
    >
      <Typography variant="h6">{part}</Typography>
    </Box>
  );
};

export default ScheduleMeetingPart;
