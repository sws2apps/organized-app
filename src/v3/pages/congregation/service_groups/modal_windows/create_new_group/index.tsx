import { Box } from '@mui/material';
import { useState } from 'react';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import { CreateNewGroupModalWindowProps } from './create_new_group.types';
import CustomTextField from '@components/textfield';
import CustomButton from '@components/button';
import CustomDragList from '../../components/drag_list';
import { StyledModalWindowConatiner } from '../modal_window.styled';

const CreateNewGroupModalWindow = (props: CreateNewGroupModalWindowProps) => {
  const { t } = useAppTranslation();

  const [creatingGroupFinnalyStage, setCreatingGroupFinnalyStage] =
    useState(false);

  const [groupName, setGroupName] = useState('');

  // TODO: Set index for group
  // TODO: Connect to API
  const groupNumber = 0;

  return !creatingGroupFinnalyStage ? (
    <StyledModalWindowConatiner className="pop-up-shadow">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <CustomTypography className="h2">
          {t('tr_createNewGroupTitle')}
        </CustomTypography>
        <CustomTypography className="body-regular" color={'var(--grey-400)'}>
          {t('tr_createNewGroupDesc')}
        </CustomTypography>
      </Box>

      <Box
        sx={{
          gap: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomTextField
          label={t('tr_groupNameOptional')}
          value={groupName}
          onChange={(event) => {
            setGroupName(event.target.value);
          }}
        />

        <Box
          sx={{
            display: 'flex',
            gap: '16px',
          }}
        >
          <CustomTextField
            select
            label={t('tr_groupOverseer')}
            sx={{ flex: 1 }}
          />
          <CustomTextField
            select
            label={t('tr_groupOverseerAssistant')}
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <CustomButton
          variant="main"
          onClick={() => setCreatingGroupFinnalyStage(true)}
        >
          {t('tr_next')}
        </CustomButton>
        <CustomButton variant="secondary" onClick={props.onCancelButtonClick}>
          {t('tr_cancel')}
        </CustomButton>
      </Box>
    </StyledModalWindowConatiner>
  ) : (
    <StyledModalWindowConatiner className="pop-up-shadow">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <CustomTypography className="h2">
          {t('tr_groupNumber', { groupNumber: groupNumber })}
        </CustomTypography>
        <CustomTypography className="body-regular" color={'var(--grey-400)'}>
          {t('tr_createNewGroupLastStep')}
        </CustomTypography>
      </Box>
      <CustomDragList
        values={['Moris Thomas', 'Lida Rowinson', 'Ali Samura']}
        onChange={(values) => console.log(values)}
        variant="publishers"
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
        <CustomButton variant="main" onClick={props.onCreateButtonClick}>
          {t('tr_create')}
        </CustomButton>
        <CustomButton
          variant="secondary"
          onClick={() => setCreatingGroupFinnalyStage(false)}
        >
          {t('tr_back')}
        </CustomButton>
      </Box>
    </StyledModalWindowConatiner>
  );
};

export default CreateNewGroupModalWindow;
