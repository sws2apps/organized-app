import Card from '@components/card';
import Typography from '@components/typography';
import { Stack } from '@mui/material';
import useCongregationInfo from './useCongregationInfo';
import Divider from '@components/divider';
import { useAppTranslation } from '@hooks/index';
import ExternalLinks from './external_links';

const CongregationInfo = () => {
  const { t } = useAppTranslation();
  const { congName, congAddress, externalLinks } = useCongregationInfo();

  return (
    <Card sx={{ p: '24px' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing="16px"
      >
        <Stack spacing="8px">
          <Typography className="h1">{congName}</Typography>

          <Typography className="body-regular" color="var(--grey-400)">
            {congAddress}
          </Typography>
        </Stack>
      </Stack>

      {!!externalLinks?.length && (
        <>
          <Divider color="var(--accent-200)" />

          <Stack spacing="12px">
            <Typography className="body-small-semibold" color="var(--grey-400)">
              {`${t('tr_externalLinks')}:`}
            </Typography>

            <ExternalLinks />
          </Stack>
        </>
      )}
    </Card>
  );
};

export default CongregationInfo;
