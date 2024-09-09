import { Box, Stack } from '@mui/material';
import { IconEdit, IconMyGroup } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { GroupHeaderProps } from './index.types';
import useHeader from './useHeader';
import GroupBadge from '../badge';
import GroupDelete from '../../group_delete';
import GroupEdit from '../../group_edit';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';

const GroupHeader = (props: GroupHeaderProps) => {
  const { t } = useAppTranslation();

  const {
    bg_color,
    color,
    group_index,
    group_name,
    my_group,
    edit,
    handleCloseEdit,
    handleOpenEdit,
    isDelete,
    handleCloseDelete,
    handleOpenDelete,
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
      {edit && (
        <GroupEdit
          onClose={handleCloseEdit}
          onDelete={handleOpenDelete}
          index={props.index}
          group={props.group}
          open={edit}
        />
      )}

      {isDelete && (
        <GroupDelete
          onClose={handleCloseDelete}
          index={props.index}
          group_id={props.group.group_id}
          open={isDelete}
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {my_group && (
          <Box
            title={t('tr_myGroup')}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <IconMyGroup color={color} />
          </Box>
        )}

        <IconButton onClick={handleOpenEdit} sx={{ padding: 0 }}>
          <IconEdit color={color} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default GroupHeader;
