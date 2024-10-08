import { Box } from '@mui/material';
import Switch from '@components/switch';
import SwitcherContainer from '@components/switcher_container';
import Typography from '@components/typography';
import { ProfileItemContainer } from '../index.styles';
import { useAppTranslation } from '@hooks/index';
import useMinistryPreferences from './useMinistryPreferences';

const MinistryPreferences = () => {
  const { t } = useAppTranslation();

  const { addCredits, handleAddCreditsChange } = useMinistryPreferences();

  return (
    <ProfileItemContainer>
      <Typography className="h2">{t('tr_ministryPreferences')}</Typography>

      <SwitcherContainer>
        <Switch
          checked={addCredits}
          onChange={(e) => handleAddCreditsChange(e.target.checked)}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography>{t('tr_theocraticAssignmentsField')}</Typography>
          <Typography className="label-small-regular" color="var(--grey-350)">
            {t('tr_theocraticAssignmentsFieldDesc')}
          </Typography>
        </Box>
      </SwitcherContainer>
    </ProfileItemContainer>
  );
};

export default MinistryPreferences;
