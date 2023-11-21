import { Box, Button, CircularProgress, Container, Link, TextField, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { CountrySelector, CongregationSelector } from '@components';
import CongregationRole from './congregation_role';
import useCongregationCreate from './useCongregationCreate';
import { useAppTranslation } from '@hooks';

const CongregationCreate = () => {
  const {
    handleSignIn,
    country,
    congregation,
    role,
    userTmpFullname,
    isCreate,
    isProcessing,
    handleCongregationAction,
    setIsCreate,
    setRole,
    setCongregation,
    setCountry,
    setUserTmpFullname,
  } = useCongregationCreate();

  const { t } = useAppTranslation();

  return (
    <Container sx={{ marginTop: '20px' }}>
      {!isCreate && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              margin: '30px 0',
              maxWidth: '480px',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <InfoIcon color="info" sx={{ fontSize: '60px' }} />
            <Typography>{t('accountCreated')}</Typography>
          </Box>
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: '480px',
              width: '100%',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <Link component="button" underline="none" variant="body2" onClick={() => window.location.reload()}>
              {t('reloadApp')}
            </Link>

            <Button variant="contained" onClick={() => setIsCreate(true)}>
              {t('create')}
            </Button>
          </Box>
        </Box>
      )}
      {isCreate && (
        <Box>
          <Typography variant="h4" sx={{ marginBottom: '15px' }}>
            {t('createCongregationAccount')}
          </Typography>

          <Box
            sx={{
              width: '100%',
              maxWidth: '500px',
              margin: '30px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <TextField
              sx={{ width: '100%' }}
              id="outlined-fullname"
              label={t('fullname')}
              variant="outlined"
              autoComplete="off"
              required
              value={userTmpFullname}
              onChange={(e) => setUserTmpFullname(e.target.value)}
            />

            <CountrySelector handleCountryChange={setCountry} />
            {country !== null && <CongregationSelector country={country} setCongregation={setCongregation} />}
            {congregation !== null && <CongregationRole role={role} setRole={setRole} />}
          </Box>

          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: '500px',
              width: '100%',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <Link component="button" underline="none" variant="body2" onClick={handleSignIn}>
              {t('hasAccount')}
            </Link>

            <Button
              variant="contained"
              disabled={isProcessing}
              endIcon={isProcessing ? <CircularProgress size={25} /> : null}
              onClick={handleCongregationAction}
            >
              {t('create')}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CongregationCreate;
