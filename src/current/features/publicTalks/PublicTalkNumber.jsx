import Typography from '@mui/material/Typography';

const PublicTalkNumber = ({ talk_number }) => {
  return (
    <Typography
      sx={{
        backgroundColor: '#3f51b5',
        width: '60px',
        minWidth: '60px',
        textAlign: 'right',
        fontSize: '25px',
        fontWeight: 'bold',
        color: 'white',
        padding: '0 10px',
        height: '40px',
        borderRadius: '5px',
      }}
    >
      {talk_number}
    </Typography>
  );
};

export default PublicTalkNumber;
