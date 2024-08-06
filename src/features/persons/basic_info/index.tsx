import { Box, Divider, FormControlLabel, RadioGroup } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useBasicInfo from './useBasicInfo';
import Badge from '@components/badge';
import DatePicker from '@components/date_picker';
import Radio from '@components/radio';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const PersonBasicInfo = () => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const {
    person,
    handleChangeBirthDate,
    age,
    handleToggleGender,
    handleChangeFirstname,
    handleChangeLastname,
    handleChangeDisplayName,
    handleChangeAddress,
    handleChangeEmailAddress,
    handleChangePhone,
    nameFlex,
    isInactive,
    displayNameEnabled,
  } = useBasicInfo();

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        display: 'flex',
        padding: '16px',
        gap: '16px',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
        flex: 1,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <Typography className="h2">{t('tr_basicInformation')}</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {person.person_data.archived.value && (
            <Badge
              size="big"
              color="red"
              text={t('tr_archived')}
              sx={{ width: 'fit-content' }}
            />
          )}

          {isInactive && (
            <Badge
              size="big"
              color="red"
              text={t('tr_inactive')}
              sx={{ width: 'fit-content' }}
            />
          )}

          {person.person_data.disqualified.value && (
            <Badge
              size="big"
              color="red"
              text={t('tr_disqualified')}
              sx={{ width: 'fit-content' }}
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          marginTop: '8px',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: nameFlex,
          }}
        >
          <TextField
            label={t('tr_firstname')}
            value={person.person_data.person_firstname.value}
            onChange={(e) => handleChangeFirstname(e.target.value)}
          />
          <TextField
            label={t('tr_lastname')}
            value={person.person_data.person_lastname.value}
            onChange={(e) => handleChangeLastname(e.target.value)}
          />
        </Box>
        {displayNameEnabled && (
          <TextField
            label={t('tr_displayName')}
            value={person.person_data.person_display_name.value}
            onChange={(e) => handleChangeDisplayName(e.target.value)}
          />
        )}
      </Box>

      <RadioGroup
        sx={{
          marginLeft: '4px',
          flexDirection: 'row',
          gap: tabletDown ? '16px' : '24px',
          flexWrap: 'wrap',
        }}
        value={person.person_data.male.value ? 'male' : 'female'}
        onChange={(e) => handleToggleGender(e.target.value)}
      >
        <FormControlLabel
          value="male"
          control={<Radio />}
          label={<Typography>{t('tr_male')}</Typography>}
        />
        <FormControlLabel
          value="female"
          control={<Radio />}
          label={<Typography>{t('tr_female')}</Typography>}
        />
      </RadioGroup>

      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          alignItems: tabletDown ? 'flex-start' : 'center',
          width: '100%',
          flexDirection: tabletDown ? 'column' : 'row',
        }}
      >
        <Box sx={{ flexGrow: 1, width: tabletDown ? '100%' : 'unset' }}>
          <DatePicker
            label={t('tr_dateOfBirth')}
            value={
              person.person_data.birth_date.value === null
                ? null
                : new Date(person.person_data.birth_date.value)
            }
            onChange={handleChangeBirthDate}
            maxDate={new Date()}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: 'var(--accent-150)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-l)',
            height: tabletDown ? 'auto' : '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
          }}
        >
          <Typography className="h4" color="var(--accent-dark)">
            {t('tr_userAge', { userAge: age })}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'var(--accent-200)' }} />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          marginTop: '8px',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: tabletDown ? 'column' : 'row',
          }}
        >
          <TextField
            label={t('tr_emailAddress')}
            value={person.person_data.email.value}
            onChange={(e) => handleChangeEmailAddress(e.target.value)}
          />
          <TextField
            label={t('tr_phoneNumber')}
            value={person.person_data.phone.value}
            onChange={(e) => handleChangePhone(e.target.value)}
          />
        </Box>
        <TextField
          label={t('tr_address')}
          value={person.person_data.address.value}
          onChange={(e) => handleChangeAddress(e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default PersonBasicInfo;
