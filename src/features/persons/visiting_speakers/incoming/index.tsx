import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useIncoming from './useIncoming';
import CongregationAdd from './congregation_add';
import IncomingCongregation from './congregation_item';
import Typography from '@components/typography';
import NoCongregations from './no_congregations';

const IncomingSpeakers = () => {
  const { t } = useAppTranslation();

  const {
    incomingCongs,
    isAdding,
    handleIsAddingClose,
    currentExpanded,
    handleSetExpanded,
  } = useIncoming();

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
      {isAdding && (
        <CongregationAdd open={isAdding} onClose={handleIsAddingClose} />
      )}

      <Typography className="h2">{t('tr_otherCongregations')}</Typography>

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
