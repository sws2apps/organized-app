import { IconExport } from '@components/icons';
import { Button } from '@components/index';
import PageTitle from '@components/page_title';
import {
  LeftColumn,
  RightColumn,
  Wrapper,
} from '@features/congregation/publisher_records/Wrappers';
import PublisherDetailCard from '@features/congregation/publisher_records_detail/PublisherDetailCard';
import ServiceYearCard from '@features/congregation/publisher_records_detail/ServiceYearCard';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';

const PublisherRecordDetail = () => {
  const { t } = useAppTranslation();

  const handleExport = () => {
    console.log('Export S21');
  };
  return (
    <>
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <PageTitle
          title={t('tr_publishersRecords')}
          buttons={
            <Button startIcon={<IconExport />} onClick={handleExport}>
              {t('tr_exportS21')}
            </Button>
          }
        />
      </Box>
      <Wrapper>
        <LeftColumn>
          <PublisherDetailCard />
        </LeftColumn>
        <RightColumn>
          <ServiceYearCard />
        </RightColumn>
      </Wrapper>
    </>
  );
};

export default PublisherRecordDetail;
