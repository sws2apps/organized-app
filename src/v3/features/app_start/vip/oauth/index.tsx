import Box from '@mui/material/Box';
import { OAuthEmail, OAuthGitHub, OAuthGoogle, OAuthMicrosoft, OAuthYahoo } from './components';

const OAuth = () => {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: { mobile: '16px', laptop: '24px' } }}>
      <OAuthGoogle />
      <OAuthMicrosoft />
      <OAuthGitHub />
      <OAuthYahoo />
      <OAuthEmail />
    </Box>
  );
};

export default OAuth;
