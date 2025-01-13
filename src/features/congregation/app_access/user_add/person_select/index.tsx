import { Box, FormControlLabel, RadioGroup } from '@mui/material';
import { PersonSelectType, UsersOption, UserType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import usePersonSelect from './usePersonSelect';
import Autocomplete from '@components/autocomplete';
import Button from '@components/button';
import Radio from '@components/radio';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import { IconError, IconLoading } from '@components/icons';

const PersonSelect = (props: PersonSelectType) => {
  const { t } = useAppTranslation();

  const {
    userType,
    handleChangeUserType,
    email,
    handleEmailChange,
    persons,
    handleSelectPerson,
    selectedPerson,
    handleRunAction,
    handleSecondaryAction,
    isProcessing,
    isEmailEmpty,
    searchStatus,
  } = usePersonSelect(props);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Typography className="h2">
          {t('tr_addNewOrganizedUserTitle')}
        </Typography>
      </Box>
      {(userType !== 'baptized' || !searchStatus) && (
        <RadioGroup
          sx={{ gap: '8px', marginLeft: '10px' }}
          value={userType}
          onChange={(e) => handleChangeUserType(e.target.value as UserType)}
        >
          <FormControlLabel
            value="baptized"
            control={<Radio />}
            label={<Typography>{t('tr_accountBaptizedBrother')}</Typography>}
          />
          <FormControlLabel
            value="publisher"
            control={<Radio />}
            label={<Typography>{t('tr_publisherOrMidweekStudent')}</Typography>}
          />
        </RadioGroup>
      )}

      <Typography color={'var(--grey-400)'}>
        {userType === 'baptized'
          ? searchStatus
            ? t('tr_userFoundSuccess')
            : t('tr_addNewOrganizedUserDesc')
          : t('tr_addNewPublisherDesc')}
      </Typography>

      {userType === 'baptized' && !searchStatus && (
        <TextField
          label={t('tr_userEmailAddress')}
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          error={searchStatus === false}
          success={searchStatus}
          helperText={
            isEmailEmpty
              ? t('tr_enterUserEmail')
              : searchStatus === false
                ? t('error_app_security_user-not-found')
                : ''
          }
          endIcon={
            searchStatus === false ? (
              <IconError color="var(--red-main)" />
            ) : null
          }
        />
      )}

      <Autocomplete
        disabled={userType === 'baptized' && !searchStatus}
        label={t('tr_selectPerson')}
        hidden={userType === 'baptized' && !searchStatus}
        options={persons}
        getOptionLabel={(option: UsersOption) => option.person_name}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value.person_uid
        }
        value={selectedPerson}
        onChange={(_, value: UsersOption) => handleSelectPerson(value)}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{ margin: 0, padding: 0 }}
            key={option.person_uid}
          >
            <Typography>{option.person_name}</Typography>
          </Box>
        )}
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
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleRunAction}
        >
          {userType === 'baptized' && !searchStatus
            ? t('tr_searchUser')
            : t('tr_bindUser')}
        </Button>
        <Button variant="secondary" onClick={handleSecondaryAction}>
          {userType !== 'baptized' || !searchStatus
            ? t('tr_cancel')
            : t('tr_back')}
        </Button>
      </Box>
    </>
  );
};

export default PersonSelect;
