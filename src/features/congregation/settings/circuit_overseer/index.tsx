import { useNavigate } from 'react-router';
import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import Button from '@components/button';
import COMidweekMeetingDay from './co_midweek_meeting_day';
import CONames from './co_names';
import COWife from './co_wife';

const CircuitOverseer = () => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  return (
    <CardSection>
      <CardSectionHeader
        title={t('tr_circuitOverseer')}
        description={t('tr_circuitOverseerSettingDesc')}
      />

      <CardSectionContent>
        <Stack spacing="16px">
          <CONames />

          <COWife />

          <COMidweekMeetingDay />

          <Button
            variant="small"
            disableAutoStretch
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => navigate('/activities/circuit-overseer-visit')}
          >
            {t('tr_COManageVisits')}
          </Button>
        </Stack>
      </CardSectionContent>
    </CardSection>
  );
};

export default CircuitOverseer;
