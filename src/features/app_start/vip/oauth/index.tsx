import Box from '@mui/material/Box';
import OAuthGoogle from './google';
import OAuthYahoo from './yahoo';
import OAuthEmail from './email';

const OAuth = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: { mobile: '16px', laptop: '24px' },
      }}
    >
      <OAuthGoogle />
      <OAuthYahoo />
      <OAuthEmail />
    </Box>
  );
};

export default OAuth;
