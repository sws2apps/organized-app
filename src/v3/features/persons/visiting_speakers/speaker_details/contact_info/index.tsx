import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { SpeakerContactInfoType } from './index.types';
import useContactInfo from './useContactInfo';
import Typography from '@components/typography';
import { IconCall, IconMail } from '@components/icons';

const SpeakerContactInfo = ({ speaker }: SpeakerContactInfoType) => {
  const { t } = useAppTranslation();

  const { person } = useContactInfo(speaker);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '126px', minWidth: '126px' }}>
          <IconCall color="var(--black)" />
          <Typography className="body-small-regular">{t('tr_phoneNumber')}</Typography>
        </Box>
        <Typography className="body-small-semibold" color="var(--accent-dark)">
          {person.phone.value}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '126px', minWidth: '126px' }}>
          <IconMail color="var(--black)" />
          <Typography className="body-small-regular">{t('tr_emailAddress')}</Typography>
        </Box>
        <Typography className="body-small-semibold" color="var(--accent-dark)">
          {person.email.value}
        </Typography>
      </Box>
    </Box>
  );
};

export default SpeakerContactInfo;
