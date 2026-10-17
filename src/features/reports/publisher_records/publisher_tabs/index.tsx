import usePublisherTabs from './usePublisherTabs';
import Card from '@components/card';
import ScrollableTabs from '@components/scrollable_tabs';

const PublisherTabs = () => {
  const { tabs } = usePublisherTabs();

  return (
    <Card sx={{ flex: 1, width: '100%' }}>
      <ScrollableTabs appearance="plain" tabs={tabs} value={0} />
    </Card>
  );
};

export default PublisherTabs;
