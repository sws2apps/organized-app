import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const topHeader = '40px';
const columnWidth = '90px';

const S3Large = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '20px',
        border: '1px solid',
        width: 'fit-content',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid' }}>
        <Typography sx={{ height: topHeader }}></Typography>
        <Box
          sx={{
            height: '50px',
            borderTop: '1px solid',
            borderBottom: '1px solid',
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
          }}
        >
          <Typography>Midweek Meeting</Typography>
        </Box>
        <Box
          sx={{
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
          }}
        >
          <Typography>Weekend Meeting</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            height: topHeader,
            borderRight: '1px solid',
            borderBottom: '1px solid',
            padding: '5px',
            width: columnWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>1st week</Typography>
        </Box>
        <Typography sx={{ height: '50px' }}></Typography>
        <Typography sx={{ height: '50px' }}></Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            height: topHeader,
            borderRight: '1px solid',
            borderBottom: '1px solid',
            padding: '5px',
            width: columnWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>2nd week</Typography>
        </Box>
        <Typography sx={{ height: '50px' }}></Typography>
        <Typography sx={{ height: '50px' }}></Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            height: topHeader,
            borderRight: '1px solid',
            borderBottom: '1px solid',
            padding: '5px',
            width: columnWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>3rd week</Typography>
        </Box>
        <Typography sx={{ height: '50px' }}></Typography>
        <Typography sx={{ height: '50px' }}></Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            height: topHeader,
            borderRight: '1px solid',
            borderBottom: '1px solid',
            padding: '5px',
            width: columnWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>4th week</Typography>
        </Box>
        <Typography sx={{ height: '50px' }}></Typography>
        <Typography sx={{ height: '50px' }}></Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            height: topHeader,
            borderRight: '1px solid',
            borderBottom: '1px solid',
            padding: '5px',
            width: columnWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>5th week</Typography>
        </Box>
        <Typography sx={{ height: '50px' }}></Typography>
        <Typography sx={{ height: '50px' }}></Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            height: topHeader,
            borderRight: '1px solid',
            borderBottom: '1px solid',
            padding: '5px',
            width: columnWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>Total</Typography>
        </Box>
        <Typography sx={{ height: '50px' }}></Typography>
        <Typography sx={{ height: '50px' }}></Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            height: topHeader,
            borderBottom: '1px solid',
            padding: '5px',
            width: columnWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>Average</Typography>
        </Box>
        <Typography sx={{ height: '50px' }}></Typography>
        <Typography sx={{ height: '50px' }}></Typography>
      </Box>
    </Box>
  );
};

export default S3Large;
