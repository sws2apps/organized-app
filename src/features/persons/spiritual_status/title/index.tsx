import { Box, IconButton } from '@mui/material';
import { IconExpand } from '@components/icons';
import { SpiritualStatusTitleType } from './index.types';
import useCurrentUser from '@hooks/useCurrentUser';
import Switch from '@components/switch';
import Typography from '@components/typography';

const SpiritualStatusTitle = ({
  checked,
  onChange,
  title,
  isExpanded,
  onExpand,
}: SpiritualStatusTitleType) => {
  const { isPersonEditor } = useCurrentUser();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Switch
          checked={checked}
          onChange={onChange}
          readOnly={!isPersonEditor}
        />
        <Typography className="h3">{title}</Typography>
      </Box>
      <IconButton sx={{ padding: 0 }} onClick={onExpand}>
        <IconExpand
          color="var(--black)"
          sx={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        />
      </IconButton>
    </Box>
  );
};

export default SpiritualStatusTitle;
