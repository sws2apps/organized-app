import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { IconCloudDownload } from '@components/icons';
import useIncoming from './useIncoming';
import Button from '@components/button';
import CongregationAdd from './congregation_add';
import IncomingCongregation from './congregation_item';
import Typography from '@components/typography';
import NoCongregations from './no_congregations';

const IncomingSpeakers = () => {
  const { t } = useAppTranslation();

  const { incomingCongs, isAdding, handleIsAddingClose, currentExpanded, handleSetExpanded, congAccountConnected } =
    useIncoming();

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {isAdding && <CongregationAdd open={isAdding} onClose={handleIsAddingClose} />}

      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between', flexWrap: 'wrap' }}
      >
        <Typography className="h2">{t('tr_otherCongregations')}</Typography>

        {congAccountConnected && (
          <Button variant="secondary" startIcon={<IconCloudDownload color="var(--accent-main)" />}>
            {t('tr_getSpeakers')}
          </Button>
        )}
      </Box>

      {incomingCongs.length === 0 && <NoCongregations />}

      {incomingCongs.length > 0 &&
        incomingCongs.map((congregation) => (
          <IncomingCongregation
            key={congregation.id}
            congregation={congregation}
            currentExpanded={currentExpanded}
            onChangeCurrentExpanded={handleSetExpanded}
          />
        ))}
    </Box>
  );
};

export default IncomingSpeakers;
