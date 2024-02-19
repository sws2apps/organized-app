import { Box } from '@mui/material';
import { Typography } from '@components';
import { IconAddTime, IconStart } from '@icons';
import TimerButton from './components/TimerButton';
import { useAppTranslation } from '@hooks/index';

const MinistryTimer = ({ duration = '0:00' }: { duration?: string }) => {
  const { t } = useAppTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '4px 8px 12px 8px',
        gap: '12px',
      }}
    >
      <TimerButton text={t('tr_timerLabelTime')} icon={<IconAddTime color="var(--accent-dark)" />} />
      <Typography
        variant="h2"
        color={duration === '0:00' ? 'var(--accent-300)' : 'var(--accent-dark)'}
        sx={{
          textAlign: 'center',
          width: '64px',
          '&:hover': {
            color: duration === '0:00' ? 'var(--accent-350)' : 'var(--accent-main)',
            '@media (hover: none)': {
              color: duration === '0:00' ? 'var(--accent-300)' : 'var(--accent-dark)',
            },
          },
          '&:active': {
            color: duration === '0:00' ? 'var(--accent-400)' : 'var(--accent-click)',
          },
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {duration}
      </Typography>
      <TimerButton text={t('tr_timerLabelStart')} icon={<IconStart color="var(--accent-dark)" />} />
    </Box>
  );
};

export default MinistryTimer;
