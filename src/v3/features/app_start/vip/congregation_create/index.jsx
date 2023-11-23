import { Box } from '@mui/material';
import { CountrySelector, CongregationSelector, Typography, Button, TextField } from '@components';
import { PageHeader } from '@features/app_start';
import CongregationRole from './congregation_role';
import useCongregationCreate from './useCongregationCreate';
import { useAppTranslation } from '@hooks';
import { IconAccount } from '@icons';

const CongregationCreate = () => {
  const {
    country,
    congregation,
    role,
    userTmpFullname,
    isCreate,
    handleCongregationAction,
    setIsCreate,
    setRole,
    setCongregation,
    setCountry,
    setUserTmpFullname,
  } = useCongregationCreate();

  const { t } = useAppTranslation();

  return (
    <>
      {!isCreate && (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <PageHeader title={t('registrationSuccess')} description={t('accountCreated')} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <Typography variant="body-regular">{t('congregationCreateLabel')}</Typography>
            <Button variant="secondary" onClick={() => setIsCreate(true)}>
              {t('createCongregation')}
            </Button>
          </Box>
        </Box>
      )}
      {isCreate && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
          <PageHeader title={t('createCongregationAccount')} onClick={() => setIsCreate(false)} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              alignItems: 'flex-start',
              alignSelf: 'stretch',
              width: '100%',
            }}
          >
            <TextField
              label={t('fullname')}
              variant="outlined"
              autoComplete="off"
              required={true}
              value={userTmpFullname}
              onChange={(e) => setUserTmpFullname(e.target.value)}
              sx={{ width: '100%' }}
              startIcon={<IconAccount color="var(--accent-350)" />}
            />

            <CountrySelector handleCountryChange={setCountry} />
            {country !== null && <CongregationSelector country={country} setCongregation={setCongregation} />}
            {congregation !== null && <CongregationRole role={role} setRole={setRole} />}

            <Button variant="main" onClick={handleCongregationAction} sx={{ width: '100%' }} disabled={true}>
              {t('createCongregation')}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default CongregationCreate;
