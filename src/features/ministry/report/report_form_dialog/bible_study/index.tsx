import { Box, Stack } from '@mui/material';
import { IconClose } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useBibleStudy from './useBibleStudy';
import Button from '@components/button';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';
import TextField from '@components/textfield';

const BibleStudy = () => {
  const { t } = useAppTranslation();

  const { nameRef, handleSave, bibleStudy, handleCloseEditor, handleDelete } =
    useBibleStudy();

  return (
    <Box
      sx={{
        padding: '24px',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
      className="pop-up-shadow"
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography className="h2">
          {bibleStudy ? t('tr_editBibleStudy') : t('tr_addNewStudy')}
        </Typography>
        <IconButton onClick={handleCloseEditor}>
          <IconClose color="var(--black)" />
        </IconButton>
      </Box>

      <TextField label={t('tr_name')} inputRef={nameRef} />

      <Stack spacing="8px">
        <Button variant="main" onClick={handleSave}>
          {bibleStudy ? t('tr_saveChanges') : t('tr_save')}
        </Button>
        <Button
          variant="secondary"
          color="red"
          onClick={bibleStudy ? handleDelete : handleCloseEditor}
        >
          {bibleStudy ? t('tr_deleteStudy') : t('tr_cancel')}
        </Button>
      </Stack>
    </Box>
  );
};

export default BibleStudy;
