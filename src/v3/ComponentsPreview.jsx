import { Box, Container, MenuItem, TextField } from '@mui/material';
import {
  Button,
  Checkbox,
  FilterChip,
  MiniChip,
  MinusButton,
  PlusButton,
  Radio,
  Switch,
  Typography,
 
} from '@components';
import { useEffect, useState } from 'react';
import { IconAdd, IconAssign, IconClose, IconReturn, IconUndo, IconUpdate } from '@icons';
import { NavBar } from './layouts';

const themes = ['blue', 'green', 'orange', 'purple'];

const ComponentPreview = () => {
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [checked, setChecked] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(true);

  const handleChange = (e) => {
    setCurrentTheme(e.target.value);
  };

  useEffect(() => {
    let current = currentTheme;
    const theme = localStorage.getItem('theme');

    current = `${current}-${theme}`;

    document.documentElement.setAttribute('data-theme', current);

    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-100');
    document.querySelector("meta[name='theme-color']").setAttribute('content', themeColor);
  }, [currentTheme]);

  return (
    <Box>
      <NavBar />

      <Container
        maxWidth={false}
        sx={{
          position: 'sticky',
          top: 56,
          backgroundColor: 'var(--accent-100)',
          zIndex: 999,
          maxWidth: '1440px',
          width: '100%',
          padding: '20px',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
        }}
        className="big-card-shadow"
      >
        <TextField
          id="select-color-themes"
          select
          label="Color theme"
          value={currentTheme}
          onChange={handleChange}
          sx={{
            width: '120px',
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
      </Container>

      <Container maxWidth={false} sx={{ maxWidth: '1440px' }}>
        <Box sx={{ margin: '80px 0px' }}>
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
              <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button variant="main" startIcon={<IconAdd />}>
                  Save
                </Button>
                <Button variant="main" color="orange" startIcon={<IconUndo />}>
                  Unpublish
                </Button>
                <Button variant="main" color="red" startIcon={<IconUndo />}>
                  Unpublish
                </Button>
                <Button disabled variant="main" color="orange" startIcon={<IconUndo />}>
                  Disabled
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography variant="label-small-regular">btn-secondary</Typography>
              <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button variant="secondary" startIcon={<IconAdd />}>
                  Save
                </Button>
                <Button variant="secondary" color="red" startIcon={<IconClose />}>
                  Terminate
                </Button>
                <Button variant="secondary" color="green" startIcon={<IconClose />}>
                  Terminate
                </Button>
                <Button disabled variant="secondary" color="red" startIcon={<IconClose />}>
                  Disabled
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

            <Box sx={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography variant="label-small-regular">checkbox</Typography>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
                  <Checkbox indeterminate={true} />
                  <Checkbox checked={false} disabled={true} />
                  <Checkbox checked={true} disabled={true} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography variant="label-small-regular">radio</Typography>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <Radio checked={false} />
                  <Radio checked={true} />
                  <Radio checked={false} disabled={true} />
                  <Radio checked={true} disabled={true} />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography variant="label-small-regular">minus</Typography>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <MinusButton />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography variant="label-small-regular">plus</Typography>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <PlusButton />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography variant="label-small-regular">filter-chip</Typography>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <FilterChip label="Normal" selected={false} />
                  <FilterChip
                    label="Selected"
                    selected={filterEnabled}
                    onClick={() => setFilterEnabled((prev) => !prev)}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography variant="label-small-regular">mini-chip</Typography>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <MiniChip label="Ilya" edit={true} onDelete={() => {}} />
                  <MiniChip label="Ilya" />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography variant="label-small-regular">switch</Typography>
                <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} />
              </Box>
            </Box>
          </Box>
        </Box>
       
      </Container>
    </Box>
  );
};

export default ComponentPreview;
