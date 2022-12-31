import { useRouteError } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ErrorBoundary = () => {
  const error = useRouteError();

  console.error(error);

  return (
    <Box>
      <Box>
        <Typography>An error occured in CPE:</Typography>
      </Box>
      <Box>
        <Typography>{error.data}</Typography>
      </Box>
    </Box>
  );
};

export default ErrorBoundary;
