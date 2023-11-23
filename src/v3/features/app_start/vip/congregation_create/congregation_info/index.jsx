import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Button, CongregationSelector, CountrySelector, InfoMessage, TextField } from '@components';
import { PageHeader } from '@features/app_start';
import { IconAccount, IconError, IconLoading } from '@icons';
import CongregationRole from '../congregation_role';
import { useAppTranslation } from '@hooks/index';
import useCongregationCreate from '../useCongregationCreate';

const CongregationInfo = ({ setIsCreate }) => {
  const { t } = useAppTranslation();

  const {
    country,
    congregation,
    role,
    userTmpFullname,
    handleCongregationAction,
    setRole,
    setCongregation,
    setCountry,
    setUserTmpFullname,
    isProcessing,
    title,
    message,
    hideMessage,
    variant,
  } = useCongregationCreate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        gap: '24px',
      }}
    >
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

          <Button
            variant="main"
            onClick={handleCongregationAction}
            sx={{ width: '100%' }}
            startIcon={isProcessing ? <IconLoading width={22} height={22} /> : null}
          >
            {t('createCongregation')}
          </Button>
        </Box>
      </Box>

      <Box id="onboarding-error" sx={{ display: 'none' }}>
        <InfoMessage
          variant={variant}
          messageIcon={<IconError />}
          messageHeader={title}
          message={message}
          onClose={hideMessage}
        />
      </Box>
    </Box>
  );
};

CongregationInfo.propTypes = {
  setIsCreate: PropTypes.func,
};

export default CongregationInfo;
