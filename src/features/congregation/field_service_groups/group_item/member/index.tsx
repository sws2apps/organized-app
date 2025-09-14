import { Box, Menu, Stack } from '@mui/material';
import {
  IconAssistant,
  IconOverseer,
  IconMore,
  IconRemovePerson,
} from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { GroupMemberProps } from './index.types';
import useMember from './useMember';
import IconButton from '@components/icon_button';
import MenuItem from '@components/menuitem';
import RemovePerson from '../remove_person';
import Typography from '@components/typography';

const GroupMember = (props: GroupMemberProps) => {
  const { t } = useAppTranslation();

  const {
    member_icon,
    member_name,
    member_desc,
    icon_hover_color,
    anchorEl,
    handleCloseMenu,
    handleOpenMenu,
    open,
    item_hover_color,
    make_assistant,
    make_overseer,
    handleMakeOverseer,
    handleMakeAssistant,
    handleCloseRemove,
    handleOpenRemove,
    handlePersonRemove,
    removeOpen,
    isServiceCommittee,
    label_overseer,
  } = useMember(props);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        padding: '4px 8px',
        borderRadius: 'var(--radius-s)',
        '&:hover': {
          backgroundColor: item_hover_color,
        },
      }}
    >
      {removeOpen && (
        <RemovePerson
          action={handlePersonRemove}
          group_id={props.group_id}
          index={props.index}
          member={props.member}
          onClose={handleCloseRemove}
          open={removeOpen}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {member_icon}

        <Stack>
          <Typography>{member_name}</Typography>

          {member_desc && (
            <Typography
              className="label-small-medium"
              color={'var(--grey-400)'}
            >
              {member_desc}
            </Typography>
          )}
        </Stack>
      </Box>

      {props.editable && isServiceCommittee && (
        <>
          <IconButton
            onClick={handleOpenMenu}
            sx={{
              padding: 0,
              '&:hover': { backgroundColor: icon_hover_color },
            }}
          >
            <IconMore color="var(--grey-400)" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            sx={{
              marginTop: '8px',
              '& li': {
                borderBottom: '1px solid var(--accent-200)',
              },
              '& li:last-child': {
                borderBottom: 'none',
              },
            }}
            slotProps={{
              paper: {
                className: 'small-card-shadow',
                style: {
                  borderRadius: 'var(--radius-l)',
                  border: '1px solid var(--accent-200)',
                  backgroundColor: 'var(--white)',
                },
              },
            }}
          >
            {make_overseer && (
              <MenuItem
                onClick={handleMakeOverseer}
                sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <IconOverseer color="var(--black)" />
                <Typography>{t(label_overseer)}</Typography>
              </MenuItem>
            )}

            {make_assistant && (
              <MenuItem
                onClick={handleMakeAssistant}
                sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <IconAssistant color="var(--black)" />
                <Typography>{t('tr_makeAssistant')}</Typography>
              </MenuItem>
            )}

            <MenuItem
              onClick={handleOpenRemove}
              sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <IconRemovePerson color="var(--red-main)" />
              <Typography color="var(--red-main)">
                {t('tr_removeFromGroups')}
              </Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default GroupMember;
