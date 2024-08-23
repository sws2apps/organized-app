import { Box } from '@mui/material';
import useWeekSelector from './useWeekSelector';
import ScrollableTabs from '@components/scrollable_tabs';

const WeekSelector = () => {
  const { weeksTab, value, handleWeekChange } = useWeekSelector();

  return (
    <Box sx={{ marginTop: '-16px' }}>
      <ScrollableTabs
        tabs={weeksTab}
        value={value}
        onChange={handleWeekChange}
      />
    </Box>
  );
};

export default WeekSelector;

{
  /* <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          marginTop: '16px',
          position: 'relative',
        }}
      >
        <Badge
          text={`${t('tr_lastUpdated')} ${lastUpdated}`}
          color="grey"
          size="small"
          filled={false}
        />
        <Box
          className="body-small-semibold"
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            top: '50%',
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
            padding: '4px 12px',
            color: 'var(--accent-dark)',
            borderRadius: 'var(--radius-max)',
            border: '1px solid var(--accent-dark)',
            background: 'var(--accent-150)',
            minHeight: '26px',
            height: 'auto',
            '.MuiChip-label': {
              padding: '0px 2px 0px 0px',
            },
            '& svg': { height: '16px', width: '16px', cursor: 'pointer' },
            '& svg, & svg g, & svg g path': {
              fill: 'var(--accent-dark)',
            },
          }}
        >
          <IconDate
            sx={{
              width: '18px !important',
              height: '18px !important',
            }}
          />
          To current week
        </Box>
      </Box> */
}
