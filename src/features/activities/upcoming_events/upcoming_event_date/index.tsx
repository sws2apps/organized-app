import { Box } from '@mui/material';
import { UpcomingEventDateProps } from './index.types';
import Typography from '@components/typography';

const UpcomingEventDate = ({
  disabled,
  dayIndicatorRef,
  dayIndicatorSharedWidth,
  title,
  description,
  date,
  day,
  range,
}: UpcomingEventDateProps) => {
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
        <Typography
          className="h4"
          color={disabled ? 'var(--accent-400)' : 'var(--accent-dark)'}
          sx={{
            textWrapMode: 'nowrap',
            '&::first-letter': {
              textTransform: 'capitalize',
            },
          }}
        >
          {range || date}
        </Typography>

        {!range && (
          <Typography
            className="label-small-regular"
            color={disabled ? 'var(--accent-400)' : 'var(--accent-dark)'}
          >
            {day}
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
