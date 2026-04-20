import { Box } from '@mui/material';
import { IconDate } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { WeekScheduleHeaderProps } from './index.types';
import useWeekScheduleHeader from './useWeekScheduleHeader';
import Badge from '@components/badge';
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
        minHeight: props.lastUpdated ? '40px' : '24px',
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
          transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out',
          pointerEvents: showToCurrent ? 'auto' : 'none',
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

      {props.lastUpdated && (
        <Badge
          text={t('tr_lastUpdated', { date: props.lastUpdated })}
          color="grey"
          size="small"
          filled={false}
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      )}
    </Box>
  );
};

export default WeekScheduleHeader;
