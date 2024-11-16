import Box from '@mui/material/Box';
import OAuthEmail from './OAuthEmail';
import OAuthGoogle from './OAuthGoogle';
import OAuthYahoo from './OAuthYahoo';

const OAuth = () => {
  return (
    <Box sx={{ margin: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
      <OAuthGoogle />
      <OAuthYahoo />
      <OAuthEmail />
    </Box>
  );
};

export default OAuth;
