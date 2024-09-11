import { Box } from '@mui/material';
import { IconDragHandle } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { GroupItemProps } from './index.types';
import Typography from '@components/typography';

const GroupItem = ({ name }: GroupItemProps) => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{ padding: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}
    >
      <IconDragHandle color="var(--accent-main)" className="scrollable-icon" />
      <Typography>{t('tr_groupName', { groupName: name })}</Typography>
    </Box>
  );
};

export default GroupItem;
