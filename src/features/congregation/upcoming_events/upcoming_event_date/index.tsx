import { Box } from '@mui/material';
import { UpcomingEventDateProps } from './index.types';
import useUpcomingEventDate from './useUpcomingEventDate';
import Typography from '@components/typography';
import { Ref } from 'react';

const UpcomingEventDate = ({
  date,
  title,
  description,
  disabled,
  dayIndicatorRef,
  dayIndicatorSharedWidth,
  dayIndicatorText,
}: UpcomingEventDateProps & {
  dayIndicatorSharedWidth?: number;
  dayIndicatorRef?: Ref<unknown>;
}) => {
  const { eventDate, eventDay } = useUpcomingEventDate(date);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
      }}
    >
      <Box
        ref={dayIndicatorRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: dayIndicatorSharedWidth
            ? `${dayIndicatorSharedWidth}px`
            : 'auto',
          minWidth: '88px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-s)',
          alignItems: 'center',
          justifyContent: 'center',
          border: disabled ? '1px dashed var(--accent-300)' : 'none',
          backgroundColor: disabled ? `var(--accent-100)` : `var(--accent-150)`,
        }}
      >
        {!dayIndicatorText ? (
          <>
            <Typography
              className="h4"
              color={disabled ? 'var(--accent-400)' : 'var(--accent-dark)'}
              sx={{
                '&::first-letter': {
                  textTransform: 'capitalize',
                },
              }}
            >
              {eventDate}
            </Typography>
            <Typography
              className="label-small-regular"
              color={disabled ? 'var(--accent-400)' : 'var(--accent-dark)'}
            >
              {eventDay}
            </Typography>
          </>
        ) : (
          <Typography
            className="h4"
            color={disabled ? 'var(--accent-400)' : 'var(--accent-dark)'}
            sx={{
              '&::first-letter': {
                textTransform: 'capitalize',
              },
            }}
          >
            {dayIndicatorText}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '4px',
        }}
      >
        <Typography
          className="h4"
          color={disabled ? 'var(--grey-400)' : 'var(--black)'}
        >
          {title}
        </Typography>
        <Typography
          className="body-small-regular"
          color={disabled ? 'var(--grey-350)' : 'var(--grey-400)'}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default UpcomingEventDate;
