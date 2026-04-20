import { Box } from '@mui/material';
import { IconDate } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { WeekScheduleHeaderProps } from './index.types';
import useWeekScheduleHeader from './useWeekScheduleHeader';
import Typography from '@components/typography';

const WeekScheduleHeader = (props: WeekScheduleHeaderProps) => {
  const { t } = useAppTranslation();

  const { showToCurrent } = useWeekScheduleHeader(props);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '24px',
        marginBottom: '16px',
      }}
    >
      <Box
        onClick={showToCurrent ? props.onCurrent : undefined}
        sx={{
          borderRadius: 'var(--radius-max)',
          backgroundColor: 'var(--accent-150)',
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          padding: '4px 8px',
          cursor: showToCurrent ? 'pointer' : 'default',
          userSelect: 'none',
          height: 'fit-content',
          opacity: showToCurrent ? 1 : 0,
          transform: showToCurrent ? 'translateY(0)' : 'translateY(-6px)',
          transition:
            'opacity 300ms ease-in-out, transform 300ms ease-in-out, background-color 200ms ease-in-out',
          pointerEvents: showToCurrent ? 'auto' : 'none',
          '&:hover': {
            backgroundColor: showToCurrent
              ? 'var(--accent-200)'
              : 'var(--accent-150)',
          },
          '&:active': {
            backgroundColor: showToCurrent
              ? 'var(--accent-250)'
              : 'var(--accent-150)',
          },
        }}
      >
        <IconDate width={22} height={22} color="var(--accent-dark)" />
        <Typography
          className="body-small-semibold"
          color="var(--accent-dark)"
        >
          {t('tr_toCurrentWeek')}
        </Typography>
      </Box>

    </Box>
  );
};

export default WeekScheduleHeader;
