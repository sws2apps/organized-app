import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const S89DetailsRow = ({ leftText, rightText, alignRight }) => {
  return (
    <Box
      sx={{
        paddingTop: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Segoe UI',
          fontWeight: 'bold',
          fontSize: '15px',
          height: '20px',
          color: 'black',
        }}
      >
        {leftText}:
      </Typography>
      <Typography
        align={alignRight}
        sx={{
          fontFamily: 'Segoe UI',
          fontSize: '13px',
          color: 'black',
          height: '20px',
          borderBottom: '1px dotted black',
          width: '100%',
        }}
      >
        {rightText}
      </Typography>
    </Box>
  );
};

export default S89DetailsRow;
