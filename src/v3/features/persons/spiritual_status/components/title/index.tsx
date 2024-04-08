import { Box, IconButton } from '@mui/material';
import Switch from '@components/switch';
import Typography from '@components/typography';
import { SpiritualStatusTitleType } from './index.types';
import { IconExpand } from '@components/icons';

const SpiritualStatusTitle = ({ checked, onChange, title, isExpanded, onExpand }: SpiritualStatusTitleType) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Switch checked={checked} onChange={onChange} />
        <Typography className="h3">{title}</Typography>
      </Box>
      <IconButton sx={{ padding: 0 }} onClick={onExpand}>
        <IconExpand
          color="var(--black)"
          sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
        />
      </IconButton>
    </Box>
  );
};

export default SpiritualStatusTitle;
