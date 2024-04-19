import { Box, Container, MenuItem, Stack, TextField } from '@mui/material';
import {
  Typography,
  PublicWitnessingTimeCard,
  PublicWitnessingPlaceCard,
  ScrollableTabs,
  ProgressBarSmall,
  UserAccountItem,
} from '@components/index';
import { useEffect, useState } from 'react';

import NavBar from '@layouts/navbar';
import DrawerAssignments from '@components/preview/DrawerAssignments';
import CPETimePickerSlider from '@components/time_picker_slider';

const themes = ['blue', 'green', 'orange', 'purple'];

const scrollableTabs = {
  years: [
    {
      label: '2020',
      Component: <></>,
    },
    {
      label: '2021',
      Component: <></>,
    },
    {
      label: '2022',
      Component: <></>,
    },
    {
      label: '2023',
      Component: <></>,
    },
    {
      label: '2024',
      Component: <></>,
    },
    {
      label: '2025',
      Component: <></>,
    },
    {
      label: '2026',
      Component: <></>,
    },
    {
      label: '2027',
      Component: <></>,
    },
  ],
  months: [
    {
      label: 'January',
      Component: <></>,
    },
    {
      label: 'February',
      Component: <></>,
    },
    {
      label: 'March',
      Component: <></>,
    },
    {
      label: 'April',
      Component: <></>,
    },
    {
      label: 'May',
      Component: <></>,
    },
    {
      label: 'June',
      Component: <></>,
    },
    {
      label: 'July',
      Component: <></>,
    },
    {
      label: 'August',
      Component: <></>,
    },
    {
      label: 'September',
      Component: <></>,
    },
    {
      label: 'October',
      Component: <></>,
    },
    {
      label: 'November',
      Component: <></>,
    },
    {
      label: 'December',
      Component: <></>,
    },
  ],
};

const ComponentPreview = () => {
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [inputField, setInputField] = useState(0);

  const handleInput = (e) => {
    setInputField(e.target.value);
    console.log(e.target.value);
  };
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
          <Box>
            <DrawerAssignments />
          </Box>
          <Box marginBottom={2} sx={{ display: 'flex', flexDirection: 'row', gap: '25px' }}>
            <PublicWitnessingPlaceCard label={'Time Square'} />
            <PublicWitnessingPlaceCard label={'Time Square'} isDelete />
          </Box>
          <Box
            marginBottom={2}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '25px',
              backgroundColor: 'var(--white)',
              padding: '15px',
              border: '1px solid var(--accent-300)',
              borderRadius: 'var(--radius-l)',
            }}
          >
            <Box>
              <PublicWitnessingTimeCard
                label={'11:00 - 12:00'}
                witnesses={['Ruben Curtis', 'Cooper Donin']}
                needWitnesses={2}
              />
            </Box>
            <Box>
              <PublicWitnessingTimeCard
                label={'11:00 - 12:00'}
                witnesses={['Ruben Curtis', 'Cooper Donin']}
                needWitnesses={3}
              />
            </Box>
            <Box>
              <PublicWitnessingTimeCard label={'11:00 - 12:00'} />
            </Box>
            <Box>
              <PublicWitnessingTimeCard
                label={'11:00 - 12:00'}
                witnesses={['Ruben Curtis', 'Cooper Donin']}
                needWitnesses={2}
                isPast
              />
            </Box>
            <Box>
              <PublicWitnessingTimeCard label={'11:00 - 12:00'} isPast />
            </Box>
          </Box>
          <Stack
            marginBottom={2}
            spacing={2}
            direction={'column'}
            sx={{
              display: 'flex',
              backgroundColor: 'var(--white)',
              padding: '15px',
              border: '1px solid var(--accent-300)',
              borderRadius: 'var(--radius-l)',
            }}
          >
            <PublicWitnessingTimeCard
              isDay={true}
              label={'11:00 - 12:00'}
              witnesses={['Ruben Curtis', 'Cooper Donin']}
              needWitnesses={2}
            />
            <PublicWitnessingTimeCard
              isDay={true}
              label={'11:00 - 12:00'}
              witnesses={['Ruben Curtis', 'Cooper Donin']}
              needWitnesses={4}
            />
            <PublicWitnessingTimeCard label={'11:00 - 12:00'} isDay />
            <PublicWitnessingTimeCard label={'11:00 - 12:00'} isDay isPast />
            <PublicWitnessingTimeCard
              label={'11:00 - 12:00'}
              isDay
              witnesses={['Ruben Curtis', 'Cooper Donin']}
              needWitnesses={2}
              isPast
            />
          </Stack>
        </Box>

        <Box sx={{ mb: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <ScrollableTabs tabs={scrollableTabs.years}></ScrollableTabs>
          <ScrollableTabs tabs={scrollableTabs.months}></ScrollableTabs>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography className="label-small-regular">input for testing progressbar</Typography>
          <TextField type="number" onChange={handleInput} value={inputField}></TextField>
          <Typography className="label-small-regular">progress-bar-small</Typography>
          <ProgressBarSmall value={inputField} maxValue={100} />
          <ProgressBarSmall value={60} maxValue={135} />
          <ProgressBarSmall value={100} maxValue={120} />
        </Box>

        <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography className="label-small-regular">user-buttons:</Typography>

            <Typography className="label-small-regular">admin-account-item</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <UserAccountItem variant="admin" userName="Jeremiah Green" userPosition="App administrator" />
            </Box>

            <Typography className="label-small-regular">user-account-item</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <UserAccountItem variant="user" userName="Floyd Miles" />
            </Box>

            <Typography className="label-small-regular">baptized-account-item</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <UserAccountItem variant="baptized" userName="Ronald Richards" />
            </Box>
          </Box>
        </Box>

        <Box>
          <CPETimePickerSlider
            ampm={false}
            onChange={(seconds) => {
              console.log(seconds);
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ComponentPreview;
