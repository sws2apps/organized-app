import { Box } from '@mui/material';
import { IconDate } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { WeekScheduleHeaderProps } from './index.types';
import useWeekScheduleHeader from './useWeekScheduleHeader';
import Badge from '@components/badge';
import Typography from '@components/typography';

const WeekScheduleHeader = (props: WeekScheduleHeaderProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { showToCurrent } = useWeekScheduleHeader(props);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        minHeight: laptopUp ? '40px' : '70px',
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

      <Badge
        text={`${t('tr_lastUpdated')} Aug 22, 2024`}
        color="grey"
        size="small"
        filled={false}
        sx={{ position: 'absolute', left: 0, top: laptopUp ? 10 : 40 }}
      />
    </Box>
  );
};

export default WeekScheduleHeader;
