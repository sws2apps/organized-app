import { Box, Stack } from '@mui/material';
import { IconDelete, IconEncryptionKey } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useDeleteCongregation from './useDeleteCongregation';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const DeleteCongregation = () => {
  const { t } = useAppTranslation();

  const {
    handleDeleteOpen,
    modalOpen,
    handleDeleteClose,
    handleDelete,
    isProcessing,
    masterKey,
    setMasterKey,
  } = useDeleteCongregation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {modalOpen && (
        <Dialog
          onClose={handleDeleteClose}
          open={modalOpen}
          sx={{ padding: '24px' }}
        >
          <Stack spacing="16px">
            <Typography className="h3">{t('tr_deleteCongregation')}</Typography>

            <Typography color="var(--grey-400)">
              {t('tr_deleteCongregationDesc')}
            </Typography>
          </Stack>

          <TextField
            type="password"
            placeholder={t('tr_deleteCongregationMasterKeyRequired')}
            variant="outlined"
            autoComplete="off"
            value={masterKey}
            onChange={(e) => setMasterKey(e.target.value)}
            startIcon={<IconEncryptionKey />}
            resetHelperPadding={true}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
            }}
          >
            <Button
              variant="main"
              color="red"
              disabled={masterKey.length < 16}
              endIcon={
                isProcessing && (
                  <WaitingLoader
                    size={22}
                    color="var(--white)"
                    variant="standard"
                  />
                )
              }
              onClick={handleDelete}
            >
              {t('tr_delete')}
            </Button>
            <Button
              variant="secondary"
              disabled={isProcessing}
              onClick={handleDeleteClose}
            >
              {t('tr_cancel')}
            </Button>
          </Box>
        </Dialog>
      )}

      <Button
        disableAutoStretch
        variant="small"
        color="red"
        onClick={handleDeleteOpen}
        startIcon={<IconDelete />}
        sx={{ minHeight: '28px', height: '28px' }}
      >
        {t('tr_deleteCongregation')}
      </Button>
    </Box>
  );
};

export default DeleteCongregation;
