import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { SpecificRecordsProps } from './index.types';
import useSpecificRecords from './useSpecificRecords';
import ScrollableTabs from '@components/scrollable_tabs';
import Typography from '@components/typography';

const SpecificRecords = (props: SpecificRecordsProps) => {
  const { t } = useAppTranslation();

  const { tabs } = useSpecificRecords(props);

  return (
    <>
      <Stack spacing="16px">
        <Typography className="h2">{t('tr_S21CardTitle')}</Typography>

        <Typography color="var(--grey-400)">
          {t('tr_S21ExportMultipleDesc')}
        </Typography>
      </Stack>

      <ScrollableTabs appearance="plain" tabs={tabs} value={0} />
    </>
  );
};

export default SpecificRecords;
