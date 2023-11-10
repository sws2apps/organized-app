import { Box, Container, Typography } from '@mui/material';
import { Button } from './components';

const App = () => {
  const switchTheme = () => {
    const themes = [
      'blue-light',
      'blue-dark',
      'green-light',
      'green-dark',
      'orange-light',
      'orange-dark',
      'purple-light',
      'purple-dark',
    ];
    const random = Math.floor(Math.random() * themes.length);
    const current = themes[random];
    console.log(current);

    document.documentElement.setAttribute('data-theme', current);
  };

  const variant = 'main';

  return (
    <Container>
      <Typography color="success" sx={{ color: 'var(--accent-400)', marginBottom: '10px' }}>
        Hello CPE
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Button onClick={switchTheme} variant={variant}>
          Switch Theme
        </Button>
        <Button disabled variant={variant}>
          Disabled
        </Button>
      </Box>
    </Container>
  );
};

export default App;
