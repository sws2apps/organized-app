import { Box, Container, MenuItem, TextField } from '@mui/material';
import {
  Button,
  Checkbox,
  FilterChip,
  MiniChip,
  MinusButton,
  Badge,
  PlusButton,
  Radio,
  Switch,
  Typography,
  UserCard,
  InfoTip,
  Loading,
} from '@components';
import { useEffect, useState } from 'react';
import { IconAdd, IconAssign, IconClose, IconReturn, IconUndo, IconUpdate, IconInfo, IconVisitors } from '@icons';

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
              <Typography className="label-small-regular">variant huge-numbers</Typography>
              <Typography className="huge-numbers">16</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant big-numbers</Typography>
              <Typography className="big-numbers">16</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant h1</Typography>
              <Typography className="h1">Hello World</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant h2</Typography>
              <Typography className="h2">Hello World</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant h2-caps</Typography>
              <Typography className="h2-caps">Hello World</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant h3</Typography>
              <Typography className="h3">Hello World</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant h4</Typography>
              <Typography className="h4">Hello World</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant button-caps</Typography>
              <Typography className="button-caps">Hello World</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant body-regular</Typography>
              <Typography className="body-regular">Hello World</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant body-small-semibold</Typography>
              <Typography className="body-small-semibold">Hello World</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant body-small-regular</Typography>
              <Typography className="body-small-regular">Hello World</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant label-small-medium</Typography>
              <Typography className="label-small-medium">Hello World</Typography>
            </Box>
            <Box>
              <Typography className="label-small-regular">variant label-small-regular</Typography>
              <Typography className="label-small-regular">Hello World</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography className="label-small-regular">btn-main</Typography>
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
              <Typography className="label-small-regular">btn-secondary</Typography>
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
              <Typography className="label-small-regular">btn-tertiary</Typography>
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
              <Typography className="label-small-regular">btn-small</Typography>
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
              <Typography className="label-small-regular">
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
                <Typography className="label-small-regular">checkbox</Typography>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
                  <Checkbox indeterminate={true} />
                  <Checkbox checked={false} disabled={true} />
                  <Checkbox checked={true} disabled={true} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography className="label-small-regular">radio</Typography>
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
                <Typography className="label-small-regular">minus</Typography>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <MinusButton />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography className="label-small-regular">plus</Typography>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <PlusButton />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography className="label-small-regular">filter-chip</Typography>
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
                <Typography className="label-small-regular">mini-chip</Typography>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <MiniChip label="Ilya" edit={true} />
                  <MiniChip label="Ilya" />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography className="label-small-regular">switch</Typography>
                <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Typography className="label-small-regular">info-tip:</Typography>

                <Typography className="label-small-regular">info</Typography>
                <InfoTip
                  isBig={false}
                  icon={<IconInfo />}
                  color="white"
                  text="Select a territory to see detailed assignment history"
                />

                <Typography className="label-small-regular">info-big</Typography>
                <InfoTip
                  isBig={true}
                  icon={<IconInfo />}
                  title="You don’t have any territories yet"
                  color="white"
                  text="Do you want to have one? Click “Get new territory” to see the list of available territories and pick one that you want to work on."
                />

                <Typography className="label-small-regular">info-alt</Typography>
                <InfoTip
                  isBig={false}
                  icon={<IconInfo />}
                  color="blue"
                  text="You don’t have any other congregations yet. Add one here to see their speakers list and use it in schedules."
                />

                <Typography className="label-small-regular">info-alt-big</Typography>
                <InfoTip
                  isBig={true}
                  icon={<IconInfo />}
                  title="My previous territories"
                  color="blue"
                  text="You don’t have any territories in the history. New territories will appear here after you cover and return them."
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              badge-small
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <Badge text="Michael Walth" color="grey" size="small" filled={false} />
                <Badge text="Michael Walth" color="green" size="small" filled={false} icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="orange" size="small" filled={false} icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="accent" size="small" filled={false} icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="red" size="small" filled={false} icon={<IconVisitors />} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              badge-small-filled
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <Badge text="Michael Walth" color="grey" size="small" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="green" size="small" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="orange" size="small" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="accent" size="small" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="red" size="small" filled icon={<IconVisitors />} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              badge-medium
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <Badge text="Michael Walth" color="grey" size="medium" filled={false} icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="green" size="medium" filled={false} icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="orange" size="medium" filled={false} icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="accent" size="medium" filled={false} icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="red" size="medium" filled={false} icon={<IconVisitors />} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              badge-medium-filled
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <Badge text="Michael Walth" color="grey" size="medium" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="green" size="medium" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="orange" size="medium" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="accent" size="medium" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="red" size="medium" filled icon={<IconVisitors />} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              badge-big
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <Badge text="Michael Walth" color="grey" size="big" filled={false} icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="green" size="big" filled={false} icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="orange" size="big" filled={false} icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="accent" size="big" filled={false} icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="red" size="big" filled={false} icon={<IconVisitors />} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              badge-big-filled
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <Badge text="Disqualified" color="grey" size="big" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="green" size="big" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="orange" size="big" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="accent" size="big" filled icon={<IconVisitors />} />
                <Badge text="Michael Walth" color="red" size="big" filled icon={<IconVisitors />} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
              user-card
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <UserCard
                  name={'Leslie Alexander'}
                  onDelete={() => {
                    console.log('delete');
                  }}
                  onClick={() => console.log('click')}
                  type="personal"
                  chipLabels={['Ilya', 'Ilya', 'Ilya', 'Ilya', 'Ilya']}
                  female
                >
                  <Badge text="Michael Walth" color="grey" size="small" filled={false} />
                  <Badge text="Michael Walth" color="green" size="small" filled={false} />
                  <Badge text="Michael Walth" color="orange" size="small" filled={false} />
                </UserCard>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <UserCard name={'Leslie Alexander'} type="pioneer" onClick={() => console.log('click')} female={false}>
                  <Badge text="Submitted on 13.10.2023" color="grey" size="small" filled={false} />
                  <Badge text="15h" color="accent" size="small" filled={false} />
                </UserCard>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }} onClick={() => console.log('click')}>
                <UserCard name={'Leslie Alexander'} type="publisher" female>
                  <Badge text="Michael Walth" color="grey" size="small" filled={false} />
                  <Badge text="Michael Walth" color="green" size="small" filled={false} />
                </UserCard>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>
          <Loading />
        </Box>
      </Container>
    </Box>
  );
};

export default ComponentPreview;
