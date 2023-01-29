import Typography from '@mui/material/Typography';

const S140PartMiniLabel = ({ align, label, width }) => {
  return (
    <Typography
      align={align}
      sx={{
        color: '#424949',
        fontSize: '9px',
        fontWeight: 'bold',
        width,
        lineHeight: '20px',
      }}
    >
      {label}
    </Typography>
  );
};

export default S140PartMiniLabel;
