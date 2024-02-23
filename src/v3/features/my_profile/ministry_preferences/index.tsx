import { Box } from '@mui/material';
import Switch from '@components/switch';
import { SwitcherItem } from '@components/global';
import Typography from '@components/typography';
import { ProfileItemContainer } from '../my_profile.styles';
import { useAppTranslation } from '@hooks/index';
import useMinistryPreferences from './useMinistryPreferences';

const MinistryPreferences = () => {
  const { t } = useAppTranslation();

  const { addCredits, handleAddCreditsChange, laptopUp } = useMinistryPreferences();

  return (
    <ProfileItemContainer>
      <Typography className="h2">{t('tr_ministryPreferences')}</Typography>

      <SwitcherItem laptopUp={laptopUp}>
        <Switch checked={addCredits} onChange={(e) => handleAddCreditsChange(e.target.checked)} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography>{t('tr_theocraticAssignmentsField')}</Typography>
          <Typography className="label-small-regular" color="var(--grey-350)">
            {t('tr_theocraticAssignmentsFieldDesc')}
          </Typography>
        </Box>
      </SwitcherItem>
    </ProfileItemContainer>
  );
};

export default MinistryPreferences;
