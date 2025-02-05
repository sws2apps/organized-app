import { Box, Stack } from '@mui/material';
import { IconAccount } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import useRequestAccess from './useRequestAccess';
import Button from '@components/button';
import CongregationSelector from '@components/congregation_selector';
import CountrySelector from '@components/country_selector';
import TextField from '@components/textfield';

const RequestAccess = () => {
  const { t } = useAppTranslation();

  const {
    firstname,
    lastname,
    setFirstname,
    setLastname,
    setCountry,
    congregation,
    country,
    setCongregation,
    handleRequestAccess,
    isProcessing,
  } = useRequestAccess();

  return (
    <Stack spacing="24px" sx={{ containerType: 'inline-size' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexDirection: { '@': 'column', '@400': 'row' },
        }}
      >
        <TextField
          label={t('tr_firstname')}
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          startIcon={<IconAccount />}
        />
        <TextField
          label={t('tr_lastname')}
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
      </Box>

      <CountrySelector handleCountryChange={setCountry} />

      {country !== null && (
        <CongregationSelector
          country_code={country.code}
          setCongregation={setCongregation}
        />
      )}

      <Button
        disabled={!congregation}
        onClick={handleRequestAccess}
        startIcon={isProcessing && <IconLoading width={22} height={22} />}
      >
        {t('tr_requestAccess')}
      </Button>
    </Stack>
  );
};

export default RequestAccess;
