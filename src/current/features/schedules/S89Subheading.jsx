import Typography from '@mui/material/Typography';

const S89Subheading = ({ subheading }) => {
  return (
    <Typography
      sx={{
        fontFamily: 'Segoe UI',
        fontSize: '13px',
        fontWeight: 'bold',
        marginTop: '10px',
        marginLeft: '10px',
        color: 'black',
      }}
    >
      {subheading}:
    </Typography>
  );
};

export default S89Subheading;
