import { Box, ButtonBase } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { dayNamesShortState } from '@states/app';
import { dateFormatFriendly } from '@utils/date';
import { IconPersonSearch } from '@components/icons';
import Typography from '@components/typography';
import ShiftsEmpty from './shifts_empty';
import { DayShiftsType, MonthViewProps } from './index.types';

const countShifts = (day: DayShiftsType) => ({
  // Slots someone can still take, including the ones looking for a partner.
  available: day.slots.filter(
    (slot) => slot.status === 'available' || slot.status === 'partner_needed'
  ).length,
  occupied: day.slots.filter(
    (slot) =>
      slot.status === 'full' ||
      (slot.status === 'past' && slot.publishers.length > 0)
  ).length,
  partnerNeeded: day.slots.some((slot) => slot.status === 'partner_needed'),
});

const MonthView = ({ days, onSelectDay }: MonthViewProps) => {
  const { t } = useAppTranslation();
  // The per-day counts only fit once the card gets the wide layout.
  const { desktopUp } = useBreakpoints();

  const dayNames = useAtomValue(dayNamesShortState);

  const hasShifts = days.some((day) => day.slots.length > 0);

  const dot = (color: string) => (
    <Box
      sx={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: color,
      }}
    />
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {!hasShifts && <ShiftsEmpty message={t('tr_noShiftsScheduled')} />}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: '4px',
        }}
      >
        {days.slice(0, 7).map((day) => (
          <Typography
            key={`weekday-${day.date}`}
            className="label-small-medium"
            color="var(--grey-400)"
            // Lines the weekday up with the date number below it.
            sx={{ padding: desktopUp ? '4px 8px' : '4px' }}
          >
            {dayNames[day.dateObj.getDay()]}
          </Typography>
        ))}

        {days.map((day) => {
          const { available, occupied, partnerNeeded } = countShifts(day);

          // The counts shrink to dots on narrow cards, so the day's state
          // has to travel with the label as well.
          const label = [
            dateFormatFriendly(day.date),
            available > 0 && t('tr_available', { number: available }),
            occupied > 0 && t('tr_occupied', { number: occupied }),
            partnerNeeded && t('tr_partnerNeeded'),
          ]
            .filter(Boolean)
            .join(', ');

          return (
            <ButtonBase
              key={day.date}
              disableRipple
              aria-label={label}
              onClick={() => onSelectDay(day.date)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: '4px',
                minHeight: desktopUp ? '96px' : '56px',
                padding: desktopUp ? '8px' : '4px',
                borderRadius: 'var(--radius-m)',
                // Today keeps the accent ring the app's date picker uses;
                // neighbouring-month days only mute their number.
                border: `1px solid ${
                  day.isToday ? 'var(--accent-main)' : 'var(--accent-200)'
                }`,
                backgroundColor: 'var(--white)',
                '&:hover': { backgroundColor: 'var(--accent-100)' },
                '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  alignSelf: 'stretch',
                }}
              >
                <Typography
                  className="body-small-semibold"
                  color={
                    day.isToday
                      ? 'var(--accent-dark)'
                      : day.inPeriod
                        ? 'var(--black)'
                        : 'var(--grey-350)'
                  }
                >
                  {day.dateObj.getDate()}
                </Typography>

                {partnerNeeded && (
                  <IconPersonSearch
                    color="var(--orange-dark)"
                    width={16}
                    height={16}
                  />
                )}
              </Box>

              {desktopUp ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    minWidth: 0,
                  }}
                >
                  {available > 0 && (
                    <Typography
                      className="label-small-medium"
                      color="var(--accent-dark)"
                    >
                      {t('tr_available', { number: available })}
                    </Typography>
                  )}
                  {occupied > 0 && (
                    <Typography
                      className="label-small-medium"
                      color="var(--accent-400)"
                    >
                      {t('tr_occupied', { number: occupied })}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: '3px' }}>
                  {available > 0 && dot('var(--accent-main)')}
                  {occupied > 0 && dot('var(--accent-300)')}
                </Box>
              )}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};

export default MonthView;
