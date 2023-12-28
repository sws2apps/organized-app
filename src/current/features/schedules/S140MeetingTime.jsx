import Typography from '@mui/material/Typography';

const S140MeetingTime = ({ partTime }) => {
  return (
    <Typography sx={{ fontWeight: 'bold', color: '#424949', fontSize: '11px', lineHeight: '20px', width: '40px' }}>
      {partTime}
    </Typography>
  );
};

export default S140MeetingTime;
