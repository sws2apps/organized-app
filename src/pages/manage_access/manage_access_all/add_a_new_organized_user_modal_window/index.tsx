import CustomButton from '@components/button';
import CustomRadio from '@components/radio';
import CustomTextField from '@components/textfield';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { AddANewOrganizedUserModalWindowProps } from './add_a_new_organized_user_modal_window.types';

const AddANewOrganizedUserModalWindow = (
  props: AddANewOrganizedUserModalWindowProps
) => {
  const { t } = useAppTranslation();

  const [userType, setUserType] = useState('baptized');

  const [userEmailAddress, setUserEmailAddress] = useState('');

  const CustomRadioWithLabel = (props: {
    checked: boolean;
    label: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <CustomRadio onChange={props.onChange} checked={props.checked} />
        <CustomTypography
          sx={{
            cursor: 'pointer',
          }}
          className="body-regular"
          onClick={() => {
            props.onChange(null, true);
          }}
        >
          {props.label}
        </CustomTypography>
      </Box>
    );
  };

  return (
    <Box
      className="pop-up-shadow"
      sx={{
        padding: '24px',
        gap: '24px',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '500px',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <CustomTypography className="h2" color={'var(--black)'}>
          {t('tr_addNewOrganizedUserTitle')}
        </CustomTypography>
        <CustomTypography className="body-regular" color={'var(--grey-400)'}>
          {t('tr_addNewOrganizedUserDesc')}
        </CustomTypography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <CustomRadioWithLabel
          label={t('tr_accountBaptizedBrother')}
          checked={userType == 'baptized'}
          onChange={() => {
            setUserType('baptized');
          }}
        />
        <CustomRadioWithLabel
          label={t('tr_accountPublisherStudent')}
          checked={userType == 'publisher'}
          onChange={() => {
            setUserType('publisher');
          }}
        />
      </Box>

      <CustomTextField
        label={t('tr_userEmailAddress')}
        type="email"
        value={userEmailAddress}
        onChange={(event) => {
          setUserEmailAddress(event.target.value);
        }}
      />

      <CustomTextField label={t('tr_selectPerson')} disabled select />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <CustomButton variant="main">{t('tr_createUser')}</CustomButton>
        <CustomButton variant="secondary" onClick={props.onCancel}>
          {t('tr_cancel')}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default AddANewOrganizedUserModalWindow;
