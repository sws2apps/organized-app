import { Box } from '@mui/material';
import { IconDate } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { WeekScheduleHeaderProps } from './index.types';
import useWeekScheduleHeader from './useWeekScheduleHeader';
import Badge from '@components/badge';
import Typography from '@components/typography';

const WeekScheduleHeader = (props: WeekScheduleHeaderProps) => {
  const { t } = useAppTranslation();

  const { laptopDown } = useBreakpoints();

  const { showToCurrent } = useWeekScheduleHeader(props);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        minHeight:
          showToCurrent && laptopDown
            ? '70px'
            : props.lastUpdated
              ? '40px'
              : '0px',
        marginBottom: '16px',
      }}
    >
      {showToCurrent && (
        <Box
          onClick={props.onCurrent}
          sx={{
            borderRadius: 'var(--radius-max)',
            backgroundColor: 'var(--accent-150)',
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            padding: '4px 8px',
            cursor: 'pointer',
            userSelect: 'none',
            height: 'fit-content',
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
      )}

      {props.lastUpdated && (
        <Badge
          text={t('tr_lastUpdated', { date: props.lastUpdated })}
          color="grey"
          size="small"
          filled={false}
          sx={{
            position: 'absolute',
            left: 0,
            top: showToCurrent && laptopDown ? 40 : 10,
          }}
        />
      )}
    </Box>
  );
};

export default WeekScheduleHeader;
