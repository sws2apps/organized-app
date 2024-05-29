import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import ScrollableTabs from '@components/scrollable_tabs';

const WeekSelector = () => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        maxWidth: '360px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--accent-300)',
        backgroundColor: 'var(--white)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Typography className="h2">{t('tr_meetingWeeks')}</Typography>
      <ScrollableTabs
        tabs={[
          {
            label: '2022',
            Component: <></>,
          },
          {
            label: '2023',
            Component: <></>,
          },
          {
            label: '2024',
            Component: <></>,
          },
          {
            label: '2025',
            Component: <></>,
          },
        ]}
      />
    </Box>
  );
};

export default WeekSelector;
