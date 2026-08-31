import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { SpeakersListType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useSpeakersList from './useSpeakersList';
import Button from '@components/button';
import SpeakerEditPopup from '../../speaker_edit_popup';
import SpeakerRowEdit from '../../speaker_row_edit';
import SpeakerRowView from '../../speaker_row_view';
import Typography from '@components/typography';

const SpeakersList = ({
  isEditMode,
  cong_id,
  cong_synced,
}: SpeakersListType) => {
  const { t } = useAppTranslation();

  const { mobile400Down } = useBreakpoints();

  const {
    handleVisitingSpeakersAdd,
    incomingSpeakers,
    congregation,
    speakerToEdit,
    isAdding,
    handleOpenSpeakerEdit,
    handleCloseSpeakerEdit,
  } = useSpeakersList(cong_id, isEditMode);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(speakerToEdit || isAdding) && (
        <SpeakerEditPopup
          open={true}
          onClose={handleCloseSpeakerEdit}
          speaker={speakerToEdit}
          cong_id={cong_id}
        />
      )}

      {congregation.cong_data.cong_id.length === 0 &&
        !isEditMode &&
        incomingSpeakers.length === 0 && (
          <Typography color="var(--grey-350)">
            {t('tr_incomingCongregationNoSpeakers')}
          </Typography>
        )}

      {congregation.cong_data.request_status === 'pending' && (
        <Typography color="var(--grey-350)">
          {t('tr_incomingCongregationOnlinePending')}
        </Typography>
      )}

      {congregation.cong_data.request_status === 'disapproved' && (
        <Typography color="var(--grey-350)">
          {t('tr_incomingCongregationOnlineDisapproved')}
        </Typography>
      )}

      {congregation.cong_data.request_status === 'approved' &&
        congregation.cong_data.cong_id.length > 0 &&
        incomingSpeakers.length === 0 && (
          <Typography color="var(--grey-350)">
            {t('tr_incomingCongregationOnlineNoSpeakers')}
          </Typography>
        )}

      {incomingSpeakers.length > 0 && (
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
              <Typography
                className="body-small-regular"
                color="var(--grey-350)"
              >
                {t('tr_publicTalks')}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              '& > .MuiBox-root': {
                borderBottom: '1px solid var(--accent-200)',
                padding: '4px 0',
              },
              '& > .MuiBox-root:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            {incomingSpeakers.map((speaker) =>
              !isEditMode || cong_synced ? (
                <SpeakerRowView key={speaker.person_uid} speaker={speaker} />
              ) : (
                <SpeakerRowEdit
                  key={speaker.person_uid}
                  speaker={speaker}
                  onEdit={handleOpenSpeakerEdit}
                />
              )
            )}
          </Box>
        </Box>
      )}

      {!cong_synced && isEditMode && (
        <Button
          variant="tertiary"
          startIcon={<IconAdd />}
          sx={{ width: '100%' }}
          onClick={handleVisitingSpeakersAdd}
        >
          {t('tr_speakersAdd')}
        </Button>
      )}
    </Box>
  );
};

export default SpeakersList;
