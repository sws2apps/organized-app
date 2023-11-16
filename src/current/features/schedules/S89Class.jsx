import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

const S89Class = ({ checked, assignmentClass }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <Checkbox
        color="default"
        size="small"
        sx={{
          padding: 0,
          '& .MuiSvgIcon-root': { fontSize: 15 },
          color: 'black',
        }}
        checked={checked}
      />
      <Typography
        sx={{
          fontFamily: 'Segoe UI',
          fontSize: '12px',
          lineHeight: 1.2,
          color: 'black',
        }}
      >
        {assignmentClass}
      </Typography>
    </Box>
  );
};

export default S89Class;
