import { Stack } from '@mui/material';
import { IconDelete } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { GroupDeleteProps } from './index.types';
import useGroupDelete from './useGroupDelete';
import Button from '@components/button';
import Dialog from '@components/dialog';
import IconButton from '@components/icon_button';
import IconLoading from '@components/icon_loading';
import Typography from '@components/typography';

const GroupDelete = (props: GroupDeleteProps) => {
  const { t } = useAppTranslation();

  const {
    group_name,
    handleClose,
    handleOpen,
    open,
    handleDelete,
    isProcessing,
  } = useGroupDelete(props);

  return (
    <>
      <Dialog
        onClose={handleClose}
        open={open}
        sx={{ padding: '24px', gap: '16px' }}
      >
        <Typography className="h2">
          {t('tr_languageGroupDelete', { languageGroup: group_name })}
        </Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          {t('tr_languageGroupDeleteDesc')}
        </Typography>
        <Stack spacing="8px" width="100%">
          <Button
            variant="main"
            onClick={handleDelete}
            color="red"
            endIcon={isProcessing && <IconLoading />}
          >
            {t('tr_delete')}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            {t('tr_cancel')}
          </Button>
        </Stack>
      </Dialog>

      <IconButton onClick={handleOpen} sx={{ padding: 0.2 }}>
        <IconDelete color="var(--red-main)" />
      </IconButton>
    </>
  );
};

export default GroupDelete;
