import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { ContactDetailsType } from './index.types';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const ContactDetails = ({
  label,
  email,
  name,
  onEmailChange,
  onNameChange,
  onPhoneChange,
  phone,
  hideLabel = false,
}: ContactDetailsType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {!hideLabel && (
        <Typography className="body-small-semibold" color="var(--grey-400)">
          {label}
        </Typography>
      )}

      <TextField
        label={hideLabel ? label : t('tr_name')}
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />

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
          label={t('tr_email')}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        <TextField
          label={t('tr_phoneNumber')}
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default ContactDetails;
