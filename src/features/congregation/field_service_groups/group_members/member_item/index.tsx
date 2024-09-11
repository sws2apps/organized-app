import { Box } from '@mui/material';
import { IconDragHandle, IconRemovePerson } from '@components/icons';
import { MemberItemProps } from './index.types';
import useMemberItem from './useMemberItem';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';

const MemberItem = (props: MemberItemProps) => {
  const { name, handleRemove } = useMemberItem(props);

  return (
    <Box
      sx={{
        padding: '8px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--accent-200)',
      }}
    >
      <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <IconDragHandle
          color="var(--accent-main)"
          className="scrollable-icon"
        />
        <Typography>{name}</Typography>
      </Box>

      <IconButton onClick={handleRemove} sx={{ padding: 0 }}>
        <IconRemovePerson color="var(--red-main)" />
      </IconButton>
    </Box>
  );
};

export default MemberItem;
