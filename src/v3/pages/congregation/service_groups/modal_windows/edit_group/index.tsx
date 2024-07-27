import { Box } from '@mui/material';
import { StyledModalWindowConatiner } from '../modal_window.styled';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import { EditGroupModalWindowProps } from './edit_group.types';
import CustomButton from '@components/button';
import { IconDelete } from '@components/icons';
import CustomTextField from '@components/textfield';
import CustomDragList from '../../components/drag_list';

const EditGroupModalWindow = (props: EditGroupModalWindowProps) => {
  const { t } = useAppTranslation();

  return (
    <StyledModalWindowConatiner
      sx={{
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <CustomTypography className="h2">
          {t('tr_groupNumber', { groupNumber: props.data.groupNumber })}
        </CustomTypography>
        <CustomButton
          variant="small"
          color="red"
          onClick={props.onDeleteButtonClick}
          startIcon={<IconDelete />}
        >
          {t('tr_delete')}
        </CustomButton>
      </Box>
      <CustomTextField label={t('tr_groupNameOptional')} />

      <CustomDragList
        values={[
          'Cody Osborne',
          'Zaki Lawrence',
          'Gabriel Cantrell',
          'Melissa Caldwell',
        ]}
        variant={'publishers'}
        onChange={() => {
          // onChange
        }}
      />

      <CustomTextField
        label={t('tr_addPublishers')}
        variant="standard"
        sx={{
          '.MuiFormLabel-root[data-shrink=false]': {
            top: '6px',
            left: '8px',
            color: 'var(--accent-400)',
          },
        }}
        select
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <CustomButton
          variant="main"
          onClick={() => {
            props.onSaveButtonClick(null);
          }}
        >
          {t('tr_save')}
        </CustomButton>
        <CustomButton variant="secondary" onClick={props.onCancelButtonClick}>
          {t('tr_cancel')}
        </CustomButton>
      </Box>
    </StyledModalWindowConatiner>
  );
};

export default EditGroupModalWindow;
