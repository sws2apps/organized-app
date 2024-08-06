import { IconDate } from '@components/icons';
import { Badge } from '@components/index';
import ScrollableTabs from '@components/scrollable_tabs';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';

const days = [];
for (let i = 0; i < 30; i++) {
  days.push({
    label: new Date(
      new Date('9 oct 2024').getTime() + 1000 * 60 * 60 * 24 * 7 * i
    ).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  });
}

const SchedulePickerHeader = ({ lastUpdated }: { lastUpdated: string }) => {
  const { t } = useAppTranslation();
  return (
    <>
      <Box
        sx={{
          '& > *': { maxWidth: '100% !important' },
          // Math for the gap :
          // Screen = 1144px ; gap = 0px
          // Screen = 1250px ; gap = 10px (106px => 10px)
          // Screen = 1338px ; gap = ~20px (194px => 20px)
          '@media (min-width: 1144px)': {
            '.MuiTabs-flexContainer': {
              gap: 'min(calc((100vw - 1144px)*10/106), 32px)',
            },
          },
          '& > * > * > *:first-of-type, & > * > * > *:last-child': {
            padding: '0 10px',
            justifyContent: 'flex-start',
          },
          '& > * > * > *:last-child': {
            justifyContent: 'flex-end',
          },
        }}
      >
        <ScrollableTabs tabs={days} />
      </Box>
      <Box
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
      </Box>
    </>
  );
};

export default SchedulePickerHeader;
