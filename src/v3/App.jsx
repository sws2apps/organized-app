import { Box, Container, MenuItem, TextField } from '@mui/material';
import { Button, Typography } from '@components';
import { IconAdd, IconAssign, IconReturn, IconUpdate } from '@components/icons';
import { useState } from 'react';
import {} from './components/icons';

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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '25px', margin: '20px 0px' }}>
        <Box>
          <Typography variant="label-small-regular">variant huge-numbers</Typography>
          <Typography variant="huge-numbers">16</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant big-numbers</Typography>
          <Typography variant="big-numbers">16</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant h1</Typography>
          <Typography variant="h1">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant h2</Typography>
          <Typography variant="h2">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant h2-caps</Typography>
          <Typography variant="h2-caps">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant h3</Typography>
          <Typography variant="h3">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant h4</Typography>
          <Typography variant="h4">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant button-caps</Typography>
          <Typography variant="button-caps">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant body-regular</Typography>
          <Typography variant="body-regular">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant body-small-semibold</Typography>
          <Typography variant="body-small-semibold">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant body-small-regular</Typography>
          <Typography variant="body-small-regular">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant label-small-medium</Typography>
          <Typography variant="label-small-medium">Hello World</Typography>
        </Box>
        <Box>
          <Typography variant="label-small-regular">variant label-small-regular</Typography>
          <Typography variant="label-small-regular">Hello World</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography variant="label-small-regular">btn-main</Typography>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button variant="main" startIcon={<IconAdd />}>
              Save
            </Button>
            <Button disabled variant="main" startIcon={<IconAdd />}>
              Save
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography variant="label-small-regular">btn-secondary</Typography>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" startIcon={<IconAdd />}>
              Save
            </Button>
            <Button disabled variant="secondary" startIcon={<IconAdd />}>
              Save
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography variant="label-small-regular">btn-tertiary</Typography>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button variant="tertiary" startIcon={<IconAdd />}>
              Save
            </Button>
            <Button disabled variant="tertiary" startIcon={<IconAdd />}>
              Save
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography variant="label-small-regular">btn-small</Typography>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button variant="small" startIcon={<IconAssign />}>
              Assign
            </Button>
            <Button variant="small" color="orange" startIcon={<IconReturn />}>
              Return
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '450px' }}>
          <Typography variant="label-small-regular">
            btn-semi-white (with early preview of message-glow effect 😄)
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              background: 'var(--accent-main)',
              borderRadius: 'var(--radius-xl)',
              padding: '16px 16px 16px 24px',
            }}
            className="message-glow"
          >
            <Button variant="semi-white" startIcon={<IconUpdate />}>
              Update
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ margin: '20px 0px' }}>
        <Typography variant="label-small-regular">icons</Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            border: '1px solid var(--black)',
            padding: '15px',
            borderRadius: '10px',
          }}
        >
          <IconAdd color="var(--black)" />
          <IconAssign color="var(--black)" />
          <IconReturn color="var(--black)" />
          <IconUpdate color="var(--black)" />
        </Box>
      </Box>
    </Container>
  );
};

export default App;
