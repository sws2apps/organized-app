import { useAppTranslation } from '@hooks/index';
import { Button, PageTitle } from '@components/index';
import { IconAdd, IconEdit, IconMore, IconPerson, IconRemovePerson, IconReorder, IconVisitors, IconAssistant } from '@icons/index';
import { Box, IconButton, Stack, MenuItem, ListItemIcon, ListItemText, Menu, ListItem } from '@mui/material';
import Masonry from '@mui/lab/Masonry';

import Typography from '@components/typography';
import Badge from '@components/badge';
import useList from '@features/persons/list/useList';
import { useState, MouseEvent, FC } from 'react';
import IconGroupOverseer from '@icons/IconGroupOverseer';
import { DashboardMenu } from '@features/index';
import DashboardCard from '@features/dashboard/card';
import { styled } from '@mui/system';

const options = [
  { icon: <IconGroupOverseer color={'var(--black)'} />, title: 'Make group overseer' },
  { icon: <IconAssistant color={'var(--black)'} />, title: 'Make assistant' },
  { icon: <IconRemovePerson color={'var(--red-main) !important'} />, title: 'Remove from the group' },
];

const PersonMenu: FC<{ color?: string }> = ({ color }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ padding: '0px' }}
      >
        <IconMore color={'var(--grey-400)'} />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-l)',
              border: '1px solid var(--accent-200)',
            },
          },
        }}
      >
        {options.map((option, index) => {
          const isLast = index === options.length - 1;
          return (
            <MenuItem
              divider={!isLast}
              key={index}
              selected={option.title === 'Pyxis'}
              onClick={handleClose}
              sx={{
                color: isLast ? 'var(--red-main)' : 'var(--black)',
                borderColor: color ? `rgb(from ${color} r g b / 16%)` : 'inherit',
                '&:hover': {
                  background: !isLast && color ? `rgb(from ${color} r g b / 6%)` : 'inherit',
                  '& span': {
                    color: !isLast && color ? color : 'inherit',
                  },
                  '& svg, & svg g, & svg g path': {
                    fill: !isLast && color ? color : 'inherit',
                  },
                },
                '&:active': {
                  background: !isLast && color ? `rgb(from ${color} r g b / 12%)` : 'inherit',
                },
              }}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText>{option.title}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

const GroupHeader = ({ groupNumber, groupName = '', groupLength, color }: { groupNumber: number; groupName?: string; groupLength: number; color?: string }) => {
  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      sx={{
        padding: '8px 16px',
        alignSelf: 'stretch',
        borderRadius: 'var(--radius-m)',
        backgroundColor: color ? `rgb(from ${color} r g b / 12%)` : 'var(--accent-200)',
        position: 'relative',
      }}
      alignItems={'center'}
    >
      <Stack direction={'column'} sx={{ opacity: '100%' }}>
        <Stack direction={'row'} spacing={'8px'} alignItems={'center'}>
          <Typography className="h3" color={color ? color : 'var(--accent-dark)'}>
            {`Group ${groupNumber}`}
          </Typography>
          <Badge size={'small'} text={groupLength.toString()} color={'green'} icon={<IconVisitors />} />
        </Stack>
        <Typography className="body-regular" color={color ? color : 'var(--accent-dark)'}>
          {groupName}
        </Typography>
      </Stack>
      <IconButton sx={{ height: 'fit-content', position: 'absolute', right: '12px', padding: '4px' }}>
        <IconEdit color={color ? color : 'var(--accent-dark)'} />
      </IconButton>
    </Stack>
  );
};

export const StyledMasonry = styled(Masonry)(({ theme }) => ({
  [theme.breakpoints.down('tablet500')]: {
    '&>*': {
      width: '100%',
    },
  },
  [theme.breakpoints.up('tablet500')]: {
    '&>*': {
      width: 'calc(50% - 8px)',
      minWidth: 'unset',
    },
  },
  [theme.breakpoints.up('desktop')]: {
    '&>*': {
      width: 'calc(25% - 12px)',
      minWidth: 'unset',
    },
  },
}));

const ServiceGroups = () => {
  const { t } = useAppTranslation();
  const { persons } = useList();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_fieldServiceGroups')}
        buttons={
          <Stack direction={'row'} spacing={'8px'}>
            <Button variant="secondary" startIcon={<IconReorder />}>
              {t('tr_reorderGroups')}
            </Button>
            <Button variant="main" startIcon={<IconAdd />}>
              {t('tr_createGroup')}
            </Button>
          </Stack>
        }
      />

      <StyledMasonry spacing={2} sequential>
        <DashboardCard
          // color={'rgb(from var(--group-1) r g b / 48%)'}
          color={'rgba(var(--group-1), 0.48)'}
          header={<GroupHeader groupNumber={1} groupLength={9} color={'var(--group-1)'} />}
          fixedHeight={false}
        >
          {persons.slice(0, 9).map((person) => (
            <ListItem disablePadding key={person.person_uid}>
              <DashboardMenu
                small
                hoverColor={'rgba(var(--group-1), 0.6)'}
                activeColor={'rgb(from var(--group-1) r g b / 12%)'}
                accentHoverColor={'var(--group-1)'}
                icon={<IconPerson color={'var(--black)'} />}
                primaryText={person.person_data.person_firstname.value}
                actionComponent={<PersonMenu color={'var(--group-1)'} />}
                secondaryText={person.person_data.birth_date.value}
                height={'32px'}
              />
            </ListItem>
          ))}
        </DashboardCard>

        <DashboardCard
          color={'rgb(from var(--group-2) r g b / 48%)'}
          header={<GroupHeader groupNumber={2} groupLength={11} groupName={'Emelricherlicher Vlyn'} color={'var(--group-2)'} />}
          fixedHeight={false}
        >
          {persons.slice(0, 10).map((person) => (
            <ListItem disablePadding key={person.person_uid}>
              <DashboardMenu
                small
                icon={<IconPerson color={'var(--black)'} />}
                primaryText={person.person_data.person_firstname.value}
                actionComponent={<PersonMenu />}
                height={'32px'}
              />
            </ListItem>
          ))}
        </DashboardCard>
        <DashboardCard
          header={<GroupHeader groupNumber={3} groupLength={8} color={'var(--group-3)'} />}
          fixedHeight={false}
          color={'rgb(from var(--group-3) r g b / 48%)'}
        >
          {persons.slice(0, 8).map((person) => (
            <ListItem disablePadding key={person.person_uid}>
              <DashboardMenu
                small
                icon={<IconPerson color={'var(--black)'} />}
                primaryText={person.person_data.person_firstname.value}
                actionComponent={<PersonMenu />}
                height={'32px'}
              />
            </ListItem>
          ))}
        </DashboardCard>

        <DashboardCard
          color={'rgb(from var(--group-4) r g b / 48%)'}
          header={<GroupHeader groupNumber={4} groupLength={6} color={'var(--group-4)'} />}
          fixedHeight={false}
        >
          {persons.slice(0, 12).map((person) => (
            <ListItem disablePadding key={person.person_uid}>
              <DashboardMenu
                small
                icon={<IconPerson color={'var(--black)'} />}
                primaryText={person.person_data.person_firstname.value}
                actionComponent={<PersonMenu />}
                height={'32px'}
              />
            </ListItem>
          ))}
        </DashboardCard>
        <DashboardCard
          color={'rgb(from var(--group-5) r g b / 48%)'}
          header={<GroupHeader groupNumber={5} groupLength={6} color={'var(--group-5)'} />}
          fixedHeight={false}
        >
          {persons.slice(0, 6).map((person) => (
            <ListItem disablePadding key={person.person_uid}>
              <DashboardMenu
                small
                icon={<IconPerson color={'var(--black)'} />}
                primaryText={person.person_data.person_firstname.value}
                actionComponent={<PersonMenu />}
                height={'32px'}
              />
            </ListItem>
          ))}
        </DashboardCard>
        <DashboardCard
          color={'rgb(from var(--group-6) r g b / 48%)'}
          header={<GroupHeader groupNumber={6} groupLength={10} color={'var(--group-6)'} />}
          fixedHeight={false}
        >
          {persons.slice(0, 10).map((person) => (
            <ListItem disablePadding key={person.person_uid}>
              <DashboardMenu
                small
                icon={<IconPerson color={'var(--black)'} />}
                primaryText={person.person_data.person_firstname.value}
                actionComponent={<PersonMenu />}
                height={'32px'}
              />
            </ListItem>
          ))}
        </DashboardCard>
        <DashboardCard
          color={'rgb(from var(--group-7) r g b / 48%)'}
          header={<GroupHeader groupNumber={7} groupLength={7} color={'var(--group-7)'} />}
          fixedHeight={false}
        >
          {persons.slice(0, 7).map((person) => (
            <ListItem disablePadding key={person.person_uid}>
              <DashboardMenu
                small
                icon={<IconPerson color={'var(--black)'} />}
                primaryText={person.person_data.person_firstname.value}
                actionComponent={<PersonMenu />}
                height={'32px'}
              />
            </ListItem>
          ))}
        </DashboardCard>
      </StyledMasonry>
    </Box>
  );
};

export default ServiceGroups;
