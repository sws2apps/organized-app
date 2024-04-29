import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { SpeakersListType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useSpeakersList from './useSpeakersList';
import Button from '@components/button';
import IncomingSpeakerEdit from './edit';
import IncomingSpeakerView from './view';
import Typography from '@components/typography';

const SpeakersList = ({ speakers, isEditMode, cong_number }: SpeakersListType) => {
  const { t } = useAppTranslation();

  const { mobile400Down } = useBreakpoints();

  const { handleVisitingSpeakersAdd } = useSpeakersList();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {!isEditMode && speakers.length === 0 && (
        <Typography color="var(--grey-350)">{t('tr_incomingCongregationNoSpeakers')}</Typography>
      )}

      {!isEditMode && speakers.length > 0 && (
        <Box>
          {!mobile400Down && (
            <Box
              sx={{
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid var(--accent-200)',
              }}
            >
              <Typography
                className="body-small-regular"
                color="var(--grey-350)"
                sx={{ minWidth: '220px', width: '220px' }}
              >
                {t('tr_name')}
              </Typography>
              <Typography className="body-small-regular" color="var(--grey-350)">
                {t('tr_publicTalks')}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              '& .MuiBox-root': {
                borderBottom: '1px solid var(--accent-200)',
                paddingBottom: '10px',
              },
              '& .MuiBox-root:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            {speakers.map((speaker) => (
              <IncomingSpeakerView key={speaker.person_uid} speaker={speaker} />
            ))}
          </Box>
        </Box>
      )}

      {isEditMode && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            '& > .MuiBox-root': {
              borderBottom: '1px solid var(--accent-200)',
              paddingBottom: '16px',
            },
            '& > .MuiBox-root:last-child': {
              borderBottom: 'none',
            },
          }}
        >
          {speakers.map((speaker) => (
            <IncomingSpeakerEdit key={speaker.person_uid} speaker={speaker} />
          ))}
        </Box>
      )}

      {isEditMode && (
        <Button
          variant="tertiary"
          startIcon={<IconAdd />}
          sx={{ width: '100%' }}
          onClick={() => handleVisitingSpeakersAdd(cong_number)}
        >
          {t('tr_speakersAdd')}
        </Button>
      )}
    </Box>
  );
};

export default SpeakersList;
