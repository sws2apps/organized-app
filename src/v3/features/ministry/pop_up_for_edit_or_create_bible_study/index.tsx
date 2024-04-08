import { Box, IconButton, TextField } from '@mui/material';
import { PopUpForEditOrCreateBibleStudyProps } from './pop_up_for_edit_or_create_bible_study.types';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import { IconClose } from '@components/icons';
import CustomButton from '@components/button';
import { useEffect, useState } from 'react';

/**
 * Component for displaying a popup for editing or creating a Bible study.
 *
 * @param props - PopUpForEditOrCreateBibleStudyProps
 */
const PopUpForEditOrCreateBibleStudy = (props: PopUpForEditOrCreateBibleStudyProps) => {
  const variant = props.variant || 'add';

  const { t } = useAppTranslation();

  useEffect(() => {
    setTextFieldValue(props.value);
  }, [props.value]);

  const [textFieldValue, setTextFieldValue] = useState('');

  return (
    <Box
      sx={{
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--white)',
        display: props.open ? 'flex' : 'none',
        visibility: props.open ? 'visible' : 'hidden',
        gap: '16px',
        padding: '24px',
        width: props.width,
        maxWidth: '500px',
        flexDirection: 'column',
        marginLeft: { mobile: '16px', tablet: '24px', desktop: '32px' },
        marginRight: { mobile: '16px', tablet: '24px', desktop: '32px' },
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <CustomTypography className="h2">
          {variant == 'add' ? t('tr_addNewStudy') : t('tr_editBibleStudy')}
        </CustomTypography>
        <IconButton onClick={() => props.closeButtonClick()}>
          <IconClose />
        </IconButton>
      </Box>
      <TextField
        id="outlined-basic"
        label={t('tr_name')}
        value={textFieldValue}
        variant="outlined"
        onChange={(event) => {
          setTextFieldValue(event.target.value);
        }}
        sx={{
          width: '100%',
          '.MuiInputBase-root': {
            borderRadius: 'var(--radius-l)',
          },
          '.Mui-focused': {
            color: 'var(--accent-main)',
          },
        }}
      />
      <CustomButton
        variant={'main'}
        onClick={() => {
          props.saveButtonClick(textFieldValue);
        }}
      >
        {variant == 'add' ? t('tr_save') : t('tr_saveChanges')}
      </CustomButton>
      <CustomButton
        variant={'secondary'}
        sx={{
          color: variant == 'edit' ? 'var(--red-main)' : null,
        }}
        onClick={() => {
          props.cancelButtonClick();
        }}
      >
        {variant == 'add' ? t('tr_cancel') : t('tr_deleteStudy')}
      </CustomButton>
    </Box>
  );
};

export default PopUpForEditOrCreateBibleStudy;
