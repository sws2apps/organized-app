import { Box, Divider, FormControlLabel, RadioGroup } from '@mui/material';
import DatePicker from '@components/date_picker';
import Radio from '@components/radio';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useBasicInfo from './useBasicInfo';

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
      <Typography className="h2">{t('tr_basicInformation')}</Typography>

      <Box sx={{ display: 'flex', gap: '16px', marginTop: '8px', flexDirection: 'column' }}>
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
            value={person.person_firstname.value}
            onChange={(e) => handleChangeFirstname(e.target.value)}
          />
          <TextField
            label={t('tr_lastname')}
            value={person.person_lastname.value}
            onChange={(e) => handleChangeLastname(e.target.value)}
          />
        </Box>
        <TextField
          label={t('tr_displayName')}
          value={person.person_displayName.value}
          onChange={(e) => handleChangeDisplayName(e.target.value)}
        />
      </Box>

      <RadioGroup
        sx={{ marginLeft: '4px', flexDirection: 'row', gap: tabletDown ? '16px' : '24px', flexWrap: 'wrap' }}
        value={person.isMale.value ? 'male' : 'female'}
        onChange={(e) => handleToggleGender(e.target.value)}
      >
        <FormControlLabel
          value="male"
          control={<Radio />}
          label={<Typography className="body-regular">{t('tr_male')}</Typography>}
        />
        <FormControlLabel
          value="female"
          control={<Radio />}
          label={<Typography className="body-regular">{t('tr_female')}</Typography>}
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
            value={person.birthDate.value === null ? null : new Date(person.birthDate.value)}
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
            {t('tr_yearsNumber', { yearsCount: age })}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'var(--accent-200)' }} />

      <Box sx={{ display: 'flex', gap: '16px', marginTop: '8px', flexDirection: 'column' }}>
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
            value={person.email.value}
            onChange={(e) => handleChangeEmailAddress(e.target.value)}
          />
          <TextField
            label={t('tr_phoneNumber')}
            value={person.phone.value}
            onChange={(e) => handleChangePhone(e.target.value)}
          />
        </Box>
        <TextField
          label={t('tr_address')}
          value={person.address.value}
          onChange={(e) => handleChangeAddress(e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default PersonBasicInfo;
