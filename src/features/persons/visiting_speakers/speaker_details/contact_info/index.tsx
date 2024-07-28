import { Box, Link } from '@mui/material';
import { IconCall, IconMail } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { SpeakerContactInfoType } from './index.types';
import Button from '@components/button';
import Typography from '@components/typography';

const SpeakerContactInfo = ({ speaker, onClose }: SpeakerContactInfoType) => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '126px',
            minWidth: '126px',
          }}
        >
          <IconCall color="var(--black)" />
          <Typography className="body-small-regular">
            {t('tr_phoneNumber')}
          </Typography>
        </Box>

        {speaker.speaker_data.person_phone.value.length > 0 && (
          <Link
            underline="none"
            href={`tel:${speaker.speaker_data.person_phone.value}`}
          >
            <Typography
              className="body-small-semibold"
              color="var(--accent-dark)"
              sx={{ wordBreak: 'break-all' }}
            >
              {speaker.speaker_data.person_phone.value}
            </Typography>
          </Link>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '126px',
            minWidth: '126px',
          }}
        >
          <IconMail color="var(--black)" />
          <Typography className="body-small-regular">
            {t('tr_emailAddress')}
          </Typography>
        </Box>

        {speaker.speaker_data.person_email.value.length > 0 && (
          <Link
            underline="none"
            href={`mailto:${speaker.speaker_data.person_email.value}`}
          >
            <Typography
              className="body-small-semibold"
              color="var(--accent-dark)"
              sx={{ wordBreak: 'break-all' }}
            >
              {speaker.speaker_data.person_email.value}
            </Typography>
          </Link>
        )}
      </Box>

      <Button variant="main" onClick={onClose} sx={{ width: '100%' }}>
        {t('tr_close')}
      </Button>
    </Box>
  );
};

export default SpeakerContactInfo;
