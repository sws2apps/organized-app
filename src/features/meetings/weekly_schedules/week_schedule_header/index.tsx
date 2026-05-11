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
        display: 'grid',
        gridTemplateRows: showToCurrent ? '1fr' : '0fr',
        transition: 'grid-template-rows 300ms ease-in-out, margin-bottom 300ms ease-in-out',
        marginBottom: showToCurrent ? '16px' : '0px',
      }}
    >
      <Box
        sx={{
          overflow: 'hidden',
          minHeight: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
      <Box
        component="button"
        type="button"
        disabled={!showToCurrent}
        onClick={props.onCurrent}
        sx={{
          borderRadius: 'var(--radius-max)',
          backgroundColor: 'var(--accent-150)',
          border: 'none',
          display: 'flex',
          gap: '4px',
          font: 'inherit',
          alignItems: 'center',
          padding: '4px 8px',
          cursor: showToCurrent ? 'pointer' : 'default',
          userSelect: 'none',
          width: 'fit-content',
          height: 'fit-content',
          opacity: showToCurrent ? 1 : 0,
          transition:
            'opacity 300ms ease-in-out, background-color 200ms ease-in-out',
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
          component="span"
          className="body-small-semibold"
          color="var(--accent-dark)"
        >
          {t('tr_toCurrentWeek')}
        </Typography>
      </Box>
      </Box>
    </Box>
  );
};

export default WeekScheduleHeader;
