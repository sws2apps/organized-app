import { Box, Stack } from '@mui/material';
import { IconEdit, IconMyGroup } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { GroupHeaderProps } from './index.types';
import useHeader from './useHeader';
import EditDeleteDialog from '../edit_delete_dialog';
import GroupBadge from '../badge';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';
import Tooltip from '@components/tooltip';

const GroupHeader = (props: GroupHeaderProps) => {
  const { t } = useAppTranslation();

  const {
    bg_color,
    color,
    group_index,
    group_name,
    my_group,
    handleOpenEdit,
    handleOpenDelete,
    dlgOpen,
    handleCloseDialog,
    type,
    isServiceCommittee,
  } = useHeader(props);

  return (
    <Box
      sx={{
        padding: '8px 16px',
        borderRadius: '6px',
        backgroundColor: bg_color,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {dlgOpen && (
        <EditDeleteDialog
          type={type}
          onClose={handleCloseDialog}
          onDelete={handleOpenDelete}
          index={props.index}
          group={props.group}
          open={dlgOpen}
        />
      )}

      <Stack spacing="2px">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography className="h3" color={color}>
            {group_index}
          </Typography>
          <GroupBadge group={props.group} index={props.index} />
        </Box>

        {group_name && <Typography color={color}>{group_name}</Typography>}
      </Stack>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          paddingLeft: '15px',
        }}
      >
        {my_group && (
          <Tooltip title={t('tr_myGroup')}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconMyGroup color={color} />
            </Box>
          </Tooltip>
        )}
        {isServiceCommittee && (
          <Tooltip title={t('tr_edit')}>
            <IconButton onClick={handleOpenEdit} sx={{ padding: 0 }}>
              <IconEdit color={color} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default GroupHeader;
