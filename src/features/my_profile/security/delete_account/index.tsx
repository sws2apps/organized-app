import { Box, Stack } from '@mui/material';
import { IconEncryptionKey } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { DeleteAccountProps } from './index.types';
import useDeleteAccount from './useDeleteAccount';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const DeleteAccount = ({ open, onClose }: DeleteAccountProps) => {
  const { t } = useAppTranslation();

  const {
    handleDelete,
    isProcessing,
    isLoading,
    desc,
    isDeleteCong,
    masterKey,
    setMasterKey,
    isManageAccess,
    handleOpenManageAccess,
  } = useDeleteAccount(onClose);

  return (
    <Dialog onClose={onClose} open={open}>
      <Stack spacing="16px">
        <Typography className="h2">{t('tr_deleteAccount')}</Typography>

        {!isLoading && (
          <Typography className="body-regular" color="var(--grey-400)">
            {desc}
          </Typography>
        )}
      </Stack>

      {isLoading && <WaitingLoader size={72} variant="standard" />}

      {!isLoading && isDeleteCong && (
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
      )}

      {!isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
          }}
        >
          {!isManageAccess && (
            <Button
              variant="main"
              color="red"
              onClick={handleDelete}
              disabled={isDeleteCong ? masterKey.length < 16 : false}
              endIcon={
                isProcessing && (
                  <WaitingLoader
                    size={22}
                    color="var(--black)"
                    variant="standard"
                  />
                )
              }
            >
              {t('tr_delete')}
            </Button>
          )}

          {isManageAccess && (
            <Button variant="main" onClick={handleOpenManageAccess}>
              {t('tr_manageAccess')}
            </Button>
          )}

          <Button
            variant="secondary"
            disabled={!isManageAccess ? isProcessing : false}
            onClick={onClose}
          >
            {t('tr_cancel')}
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default DeleteAccount;
