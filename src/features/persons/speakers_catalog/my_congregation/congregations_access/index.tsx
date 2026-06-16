import { Box } from '@mui/material';
import { CongregationAccessType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useCongregationsAccess from './useCongregationsAccess';
import Button from '@components/button';
import Dialog from '@components/dialog';
import OutgoingSpeakersListActive from './active';
import OutgoingSpeakersListInactive from './inactive';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const OutgoingSpeakersAccess = ({ open, onClose }: CongregationAccessType) => {
  const { t } = useAppTranslation();

  const {
    congregations,
    isPending,
    congregationRevoke,
    handleSetDelete,
    handleRevokeAccess,
  } = useCongregationsAccess(onClose);

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      {!congregationRevoke && (
        <>
          <Typography className="h2">
            {t('tr_outgoingSpeakersAccess')}
          </Typography>

          {isPending && <WaitingLoader size={72} variant="standard" />}

          {!isPending && congregations.length === 0 && (
            <OutgoingSpeakersListInactive />
          )}

          {!isPending && congregations.length > 0 && (
            <OutgoingSpeakersListActive
              congregations={congregations}
              onDelete={handleSetDelete}
            />
          )}

          <Button variant="main" onClick={onClose} sx={{ width: '100%' }}>
            OK
          </Button>
        </>
      )}

      {congregationRevoke && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Typography className="h2">
            {t('tr_congregationAccessRevoke')}
          </Typography>

          <TextMarkup
            content={t('tr_congregationAccessRevokeDesc', {
              congregationName: congregationRevoke.cong_name,
            })}
            className="body-regular"
            color="var(--grey-400)"
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button variant="main" color="red" onClick={handleRevokeAccess}>
              {t('tr_delete')}
            </Button>
            <Button variant="secondary" onClick={() => handleSetDelete(null)}>
              {t('tr_cancel')}
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default OutgoingSpeakersAccess;
