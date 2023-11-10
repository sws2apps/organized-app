import { Box, Container, MenuItem, TextField, Typography } from '@mui/material';
import { Button } from '@components';
import { useState } from 'react';

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

const App = () => {
  const [currentTheme, setCurrentTheme] = useState('blue-light');

  const handleChange = (e) => {
    const current = e.target.value;
    setCurrentTheme(current);

    document.documentElement.setAttribute('data-theme', current);
  };

  return (
    <Container sx={{ margin: '20px 0' }}>
      <TextField
        id="select-color-themes"
        select
        label="Color theme"
        value={currentTheme}
        onChange={handleChange}
        sx={{
          '.MuiOutlinedInput-root': {
            borderRadius: 'var(--radius-l)',
            paddingRight: '8px',
            color: 'var(--black)',
            '& svg': {
              color: 'var(--accent-350)',
            },
            '&.Mui-focused svg': {
              color: 'var(--black)',
            },
            '& fieldset': {
              border: '1px solid var(--accent-350)',
            },
            '&:hover fieldset': {
              border: '1px solid var(--accent-main)',
            },
            '&.Mui-focused fieldset': {
              border: '1px solid var(--accent-main)',
            },
          },
          '.MuiInputLabel-root': {
            color: 'var(--accent-350)',
            '&.Mui-focused': {
              color: 'var(--accent-main)',
            },
          },
        }}
      >
        {themes.map((theme) => (
          <MenuItem key={theme} value={theme}>
            {theme}
          </MenuItem>
        ))}
      </TextField>

      <Typography className="h1" sx={{ color: 'var(--accent-400)', margin: '20px 0px !important' }}>
        Typography variant h1
      </Typography>
      <Typography className="h2" sx={{ color: 'var(--accent-400)', margin: '20px 0px !important' }}>
        Typography variant h2
      </Typography>
      <Typography className="h2-caps" sx={{ color: 'var(--accent-400)', margin: '20px 0px !important' }}>
        Typography variant h2-caps
      </Typography>
      <Typography className="h3" sx={{ color: 'var(--accent-400)', margin: '20px 0px !important' }}>
        Typography variant h3
      </Typography>
      <Typography className="h4" sx={{ color: 'var(--accent-400)', margin: '20px 0px !important' }}>
        Typography variant h4
      </Typography>
      <Typography className="button-caps" sx={{ color: 'var(--accent-400)', margin: '20px 0px !important' }}>
        Typography variant button-caps
      </Typography>
      <Typography className="body-regular" sx={{ color: 'var(--accent-400)', margin: '20px 0px !important' }}>
        Typography variant body-regular
      </Typography>
      <Typography className="body-small-semibold" sx={{ color: 'var(--accent-400)', margin: '20px 0px !important' }}>
        Typography variant body-small-semibold
      </Typography>
      <Typography className="body-small-regular" sx={{ color: 'var(--accent-400)', margin: '20px 0px !important' }}>
        Typography variant body-small-regular
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Button variant="main">Variant: main</Button>
          <Button disabled variant="main">
            Disabled
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary">Variant: secondary</Button>
          <Button disabled variant="secondary">
            Disabled
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Button variant="tertiary">Variant: tertiary</Button>
          <Button disabled variant="tertiary">
            Disabled
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
