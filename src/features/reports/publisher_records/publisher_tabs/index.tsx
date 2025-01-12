import usePublisherTabs from './usePublisherTabs';
import Card from '@components/card';
import ScrollableTabs from '@components/scrollable_tabs';

const PublisherTabs = () => {
  const { tabs } = usePublisherTabs();

  return (
    <Card sx={{ flex: 1, width: '100%' }}>
      <ScrollableTabs
        indicatorMode
        tabs={tabs}
        value={0}
        sx={{
          '& button.Mui-selected': {
            color: 'var(--accent-main)',
            background: 'unset',
            borderRadius: 'unset',
          },
          '& span.MuiTouchRipple-root': { borderRadius: 'var(--radius-l)' },
        }}
      />
    </Card>
  );
};

export default PublisherTabs;
