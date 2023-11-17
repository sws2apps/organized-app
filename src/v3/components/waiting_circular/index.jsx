import { CircularProgress } from '@mui/material';

const WaitingCircular = () => {
  return (
    <CircularProgress
      size={80}
      disableShrink={true}
      sx={{
        color: 'var(--accent-dark)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
      }}
    />
  );
};

export default WaitingCircular;
