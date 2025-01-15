import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { Box } from '@mui/material';

const EmptyAssignment = () => {
  const { t } = useAppTranslation();

  return (
    <Tooltip
      sx={{
        flex: '1',
      }}
      title={t('tr_partNotIncludedForThisWeek')}
      followCursor
    >
      <Box
        sx={{
          height: '48px',
          borderRadius: 'var(--radius-l)',
          border: '1px dashed var(--accent-300)',
          padding: '0px 14px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'default',
        }}
      >
        <Typography className="body-regular" color="var(--accent-300)">
          {t('tr_none')}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default EmptyAssignment;
