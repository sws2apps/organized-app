import { Box, Stack } from '@mui/material';
import { IconClose } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { BibleStudyEditorProps } from './index.types';
import useBibleStudy from './useBibleStudy';
import Button from '@components/button';
import Dialog from '@components/dialog';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';
import TextField from '@components/textfield';

const BibleStudyEditor = (props: BibleStudyEditorProps) => {
  const { t } = useAppTranslation();

  const { value, handleSave, handleDelete, handleChange } =
    useBibleStudy(props);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      sx={{ padding: '12px 24px', alignItems: 'stretch' }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography className="h2">
          {props.bibleStudy ? t('tr_editBibleStudy') : t('tr_addNewStudy')}
        </Typography>
        <IconButton onClick={props.onClose}>
          <IconClose color="var(--black)" />
        </IconButton>
      </Box>

      <TextField
        label={t('tr_name')}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />

      <Stack spacing="8px">
        <Button variant="main" onClick={handleSave}>
          {props.bibleStudy ? t('tr_saveChanges') : t('tr_save')}
        </Button>
        <Button
          variant="secondary"
          color="red"
          onClick={props.bibleStudy ? handleDelete : props.onClose}
        >
          {props.bibleStudy ? t('tr_deleteStudy') : t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default BibleStudyEditor;
