import { Box, CircularProgress, Collapse } from '@mui/material';
import { IconCheck, IconCollapse } from '@components/icons';
import { MonthItemType } from './index.types';
import useMonthItem from './useMonthItem';
import Typography from '@components/typography';
import WeekItem from '../week_item';

const MonthItem = (props: MonthItemType) => {
  const { weeks } = props;

  const {
    monthName,
    expanded,
    handleToggleExpand,
    assignComplete,
    assignPartial,
    assigned,
    total,
  } = useMonthItem(props);

  return (
    <Box>
      <Box
        sx={{
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={handleToggleExpand}
      >
        <Typography className="h4">{monthName}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {assignComplete && (
            <Box
              sx={{
                borderRadius: 'var(--radius-max)',
                width: '18.4px',
                height: '18.4px',
                padding: '2px',
                backgroundColor: 'var(--accent-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconCheck color="var(--white)" height={14.4} width={14.4} />
            </Box>
          )}

          {assignPartial && !assignComplete && (
            <Box
              sx={{
                width: '18.4px',
                height: '18.4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress
                variant="determinate"
                value={100}
                size={18.4}
                thickness={4.5}
                sx={{
                  color: 'var(--accent-200)',
                  position: 'absolute',
                }}
              />
              <CircularProgress
                variant="determinate"
                value={total > 0 ? (assigned / total) * 100 : 0}
                size={18.4}
                thickness={4.5}
                sx={{
                  color: 'var(--accent-main)',
                  '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
                }}
              />
            </Box>
          )}

          <IconCollapse
            color="var(--black)"
            sx={{
              transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s',
            }}
          />
        </Box>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {weeks.map((week) => (
          <WeekItem key={week} week={week} />
        ))}
      </Collapse>
    </Box>
  );
};

export default MonthItem;
