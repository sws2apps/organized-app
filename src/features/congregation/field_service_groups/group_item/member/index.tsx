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
import Badge from '@components/badge';
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
    member_away,
    member_badges,
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

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          minWidth: 0,
        }}
      >
        <Box sx={{ display: 'flex', flexShrink: 0 }}>{member_icon}</Box>

        <Stack sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minHeight: '24px',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <Typography sx={{ flexShrink: 0, maxWidth: '100%' }}>
              {member_name}
            </Typography>

            {member_badges.length > 0 && (
              <Box
                title={member_badges.map((badge) => badge.name).join(', ')}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '6px',
                  height: '20px',
                  minWidth: 0,
                  overflow: 'hidden',
                }}
              >
                {member_badges.map((badge) => (
                  <Badge
                    key={badge.name}
                    text={badge.name}
                    color={badge.color}
                    size="small"
                    filled={false}
                    truncate
                    sx={{ minWidth: '40px' }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {member_desc && (
            <Typography
              className="label-small-medium"
              sx={{
                color: 'var(--grey-400)',
              }}
            >
              {member_desc}
            </Typography>
          )}

          {member_away && (
            <Typography
              className="label-small-regular"
              color={'var(--grey-350)'}
              sx={{ marginTop: '2px' }}
            >
              {member_away}
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
              <Typography
                sx={{
                  color: 'var(--red-main)',
                }}
              >
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
