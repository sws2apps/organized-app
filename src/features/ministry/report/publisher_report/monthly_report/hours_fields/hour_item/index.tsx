import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useHourItem from './useHourItem';
import Typography from '@components/typography';

const HourItem = () => {
  const { t } = useAppTranslation();

  const { goal, total_hours, hoursCreditEnabled } = useHourItem();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
      }}
    >
      <Stack>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <Typography>{t('tr_totalHours')}</Typography>
          {goal && (
            <Typography
              className="body-small-semibold"
              color="var(--accent-dark)"
              sx={{
                borderRadius: 'var(--radius-s)',
                padding: '2px 8px',
                backgroundColor: 'var(--accent-150)',
              }}
            >
              {t('tr_badgeGoalHours', { ministryTime: goal })}
            </Typography>
          )}
        </Box>

        {hoursCreditEnabled && (
          <Typography className="body-small-regular" color="var(--grey-350)">
            {t('tr_includesServiceAndCredit')}
          </Typography>
        )}
      </Stack>

      <Typography
        className="h3"
        color={total_hours === '0:00' ? 'var(--accent-350)' : 'var(--black)'}
      >
        {total_hours}
      </Typography>
    </Box>
  );
};

export default HourItem;
