import { useRouteError } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      }}
    >
      <Typography>Ooops</Typography>
      <Typography>{error.message || error.data}</Typography>
    </Box>
  );
};

export default ErrorBoundary;
