import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

const S89Assignment = ({ checked, assignment, assignmentSpec, otherPart }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
              lineHeight: 1,
              color: 'black',
            }}
          >
            {assignment}
          </Typography>
        </Box>
        {otherPart && (
          <Typography
            sx={{
              lineHeight: 1,
              color: 'black',
              height: '18px',
              width: '100%',
              borderBottom: '1px dotted black',
            }}
          ></Typography>
        )}
      </Box>
      {assignmentSpec !== undefined && (
        <Box sx={{ paddingLeft: '20px', marginTop: '-7px', marginBottom: '3px' }}>
          <Typography
            sx={{
              width: '100%',
              fontFamily: 'Segoe UI',
              fontSize: '11px',
              lineHeight: '25px',
              color: 'black',
              height: '20px',
              borderBottom: '1px dotted black',
            }}
          >
            {assignmentSpec}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default S89Assignment;
