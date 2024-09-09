import { Box, Stack } from '@mui/material';
import { IconEdit, IconMyGroup } from '@components/icons';
import { GroupHeaderProps } from './index.types';
import useHeader from './useHeader';
import GroupBadge from '../badge';
import Typography from '@components/typography';
import IconButton from '@components/icon_button';

const GroupHeader = (props: GroupHeaderProps) => {
  const { bg_color, color, group_index, group_name, my_group } =
    useHeader(props);

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
        {my_group && <IconMyGroup color={color} />}

        <IconButton sx={{ padding: 0 }}>
          <IconEdit color={color} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default GroupHeader;
