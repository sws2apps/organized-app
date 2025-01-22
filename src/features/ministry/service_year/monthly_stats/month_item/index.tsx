import { Box, Stack } from '@mui/material';
import { IconCheck, IconClose } from '@components/icons';
import { MonthItemProps } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMonthItem from './useMonthItem';
import Badge from '@components/badge';
import Typography from '@components/typography';

const MonthItem = (props: MonthItemProps) => {
  const { t } = useAppTranslation();

  const { tablet600Up } = useBreakpoints();

  const {
    monthname,
    monthStatus,
    bible_studies,
    total_hours,
    isAP,
    comments,
    isFR,
    isCurrent,
    isAhead,
  } = useMonthItem(props);

  return (
    <Box
      sx={{
        padding: '2px 8px',
        display: 'flex',
        alignItems: tablet600Up && 'center',
        justifyContent: 'space-between',
        gap: tablet600Up ? '16px' : '4px',
        flexDirection: tablet600Up ? 'row' : 'column',
      }}
    >
      <Stack spacing="4px">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isFR && (
            <>
              {(monthStatus === 'confirmed' || monthStatus === 'submitted') && (
                <IconCheck width={20} height={20} color="var(--accent-main)" />
              )}
              {monthStatus === 'late' && (
                <IconClose width={20} height={20} color="var(--red-main)" />
              )}
            </>
          )}

          <Typography
            className="h4"
            sx={{ color: isAhead ? 'var(--grey-300)' : 'var(--black)' }}
          >
            {monthname}
          </Typography>

          {isAP && (
            <Badge
              className="label-small-medium"
              size="big"
              color="orange"
              sx={{ borderRadius: '2px', padding: '2px 6px' }}
              text={t('tr_AP')}
            />
          )}
        </Box>

        {!isCurrent && !isAhead && comments.length > 0 && (
          <Typography className="body-small-regular" color="var(--grey-350)">
            {comments}
          </Typography>
        )}
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isCurrent && (
          <Badge
            className="body-small-semibold"
            size="big"
            color="grey"
            sx={{ borderRadius: 'var(--radius-s)' }}
            text={t('tr_inProgress')}
          />
        )}

        {isAhead && (
          <Badge
            faded
            className="body-small-semibold"
            size="big"
            color="grey"
            sx={{ borderRadius: 'var(--radius-s)' }}
            text={t('tr_ahead')}
          />
        )}

        {!isCurrent && !isAhead && (
          <>
            {bible_studies > 0 && (
              <Badge
                className="body-small-semibold"
                size="big"
                color="grey"
                sx={{ borderRadius: 'var(--radius-s)' }}
                text={t('tr_bibleStudyCountAbbreviated', {
                  count: bible_studies,
                })}
              />
            )}

            {total_hours > 0 && (
              <Badge
                className="body-small-semibold"
                size="big"
                color="grey"
                sx={{ borderRadius: 'var(--radius-s)' }}
                text={t('tr_hoursList', {
                  Hours: total_hours,
                })}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default MonthItem;
