import { Box, Menu } from '@mui/material';
import { IconAddPerson } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { PublisherItemProps } from './index.types';
import usePublisherItem from './usePublisherItem';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';

const PublisherItem = (props: PublisherItemProps) => {
  const { t } = useAppTranslation();

  const {
    anchorEl,
    open,
    groups_list,
    handleOpenMenu,
    handleCloseMenu,
    handleAssign,
  } = usePublisherItem(props);

  return (
    <Box
      onClick={handleOpenMenu}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        padding: '4px 8px',
        borderRadius: 'var(--radius-s)',
        cursor: 'pointer',
        backgroundColor: open ? 'var(--accent-200)' : 'transparent',
        '&:hover': { backgroundColor: 'var(--accent-200)' },
      }}
    >
      <Typography>{props.publisher.name}</Typography>

      <IconAddPerson color="var(--accent-350)" />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        sx={{
          marginTop: '8px',
          '& li': { borderBottom: '1px solid var(--accent-200)' },
          '& li:last-child': { borderBottom: 'none' },
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
        {groups_list.map((group, index) => (
          <MenuItem
            key={group.group_id}
            onClick={() => handleAssign(group.group_id)}
          >
            <Typography>
              {t('tr_groupNumber', { groupNumber: index + 1 })}
              {group.group_data.name && ` — ${group.group_data.name}`}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default PublisherItem;
