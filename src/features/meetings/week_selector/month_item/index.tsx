import { Box, Collapse } from '@mui/material';
import { IconCheck, IconCollapse, IconRadioButtonUnchecked } from '@components/icons';
import { MonthItemType } from './index.types';
import useMonthItem from './useMonthItem';
import Typography from '@components/typography';
import WeekItem from '../week_item';

const MonthItem = (props: MonthItemType) => {
  const { weeks } = props;

  const { monthName, expanded, handleToggleExpand, assignComplete, assignPartial } =
    useMonthItem(props);

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
              <IconRadioButtonUnchecked
                color="var(--accent-main)"
                height={18}
                width={18}
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
