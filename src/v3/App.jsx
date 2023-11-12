import { Box, Container, MenuItem, TextField } from '@mui/material';
import { Button, Typography } from '@components';
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

    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-100');
    document.querySelector("meta[name='theme-color']").setAttribute('content', themeColor);
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', margin: '20px 0px' }}>
        <Box>
          <Typography variant="label-small-regular">Typography variant huge-numbers</Typography>
          <Typography variant="huge-numbers">16</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant big-numbers</Typography>
          <Typography variant="big-numbers">16</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant h1</Typography>
          <Typography variant="h1">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant h2</Typography>
          <Typography variant="h2">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant h2-caps</Typography>
          <Typography variant="h2-caps">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant h3</Typography>
          <Typography variant="h3">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant h4</Typography>
          <Typography variant="h4">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant button-caps</Typography>
          <Typography variant="button-caps">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant button-regular</Typography>
          <Typography variant="button-regular">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant button-small-semibold</Typography>
          <Typography variant="button-small-semibold">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant button-small-regular</Typography>
          <Typography variant="button-small-regular">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant label-small-medium</Typography>
          <Typography variant="label-small-medium">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">Typography variant label-small-regular</Typography>
          <Typography variant="label-small-regular">Hello World</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Button variant="main">button-caps: main</Button>
          <Button disabled variant="main">
            Disabled
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary">button-caps: secondary</Button>
          <Button disabled variant="secondary">
            Disabled
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Button variant="tertiary">button-caps: tertiary</Button>
          <Button disabled variant="tertiary">
            Disabled
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
