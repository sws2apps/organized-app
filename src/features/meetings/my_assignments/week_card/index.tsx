import { Box } from '@mui/material';
import { WeekCardProps } from './index.types';
import useWeekCard from './useWeekCard';
import AssignmentItem from '../assignment_item';
import DateLabel from '../date_label';
import Typography from '@components/typography';

const WeekCard = ({ week, onOpen }: WeekCardProps) => {
  const { label, isCurrent } = useWeekCard(week);

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid',
        borderColor: isCurrent ? 'var(--accent-300)' : 'var(--accent-200)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: 'var(--accent-300)' },
      }}
    >
      {label && (
        <Box
          sx={{
            padding: '10px 16px',
            backgroundColor: isCurrent
              ? 'var(--accent-150)'
              : 'var(--accent-100)',
            borderBottom: '1px solid var(--accent-200)',
          }}
        >
          <Typography
            className="body-small-semibold"
            color={isCurrent ? 'var(--accent-dark)' : 'var(--black)'}
          >
            {label}
          </Typography>
        </Box>
      )}

      {week.days.map((day, index) => (
        <Box
          key={day.date}
          sx={[
            {
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '8px',
            },
            index > 0 && {
              position: 'relative',
              // a longer dash than a dashed border can draw
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '16px',
                right: '16px',
                height: '1px',
                backgroundImage:
                  'repeating-linear-gradient(to right, var(--accent-300) 0 6px, transparent 6px 12px)',
              },
            },
          ]}
        >
          <DateLabel date={day.date} sx={{ width: '56px', flexShrink: 0 }} />

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {day.assignments.map((history) => (
              <AssignmentItem
                key={history.id}
                history={history}
                onOpen={onOpen}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default WeekCard;
