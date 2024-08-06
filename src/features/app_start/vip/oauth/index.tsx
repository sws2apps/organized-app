import Box from '@mui/material/Box';
import OAuthGoogle from './google';
import OAuthMicrosoft from './microsoft';
import OAuthGitHub from './github';
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
      <OAuthMicrosoft />
      <OAuthGitHub />
      <OAuthYahoo />
      <OAuthEmail />
    </Box>
  );
};

export default OAuth;
