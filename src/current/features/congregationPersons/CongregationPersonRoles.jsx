import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Persons } from '../../classes/Persons';

const styles = {
  checkbox: {
    paddingTop: '0 !important',
  },
};

let isRoleCheckerRan = false;

const CongregationPersonRoles = ({
  member,
  handleCheckAdmin,
  handleCheckSecretary,
  handleCheckLMMO,
  handleCheckLMMOAssistant,
  handleCheckViewMeetingSchedule,
  handleCheckPublicTalkCoordinator,
  handleCheckCoordinator,
}) => {
  const { t } = useTranslation('ui');

  const [disableViewMeetingRole, setDisableViewMeetingRole] = useState(false);

  useEffect(() => {
    if (!isRoleCheckerRan) {
      setDisableViewMeetingRole(false);

      if (member.cong_role) {
        const secretaryRole = member.cong_role.includes('secretary');
        const lmmoRole = member.cong_role.includes('lmmo') || member.cong_role.includes('lmmo-backup');

        const currentPerson = Persons.get(member.user_local_uid);
        const isElder = currentPerson?.isElder();
        const isMS = currentPerson?.isMS();
        const isPublisher = currentPerson?.isPublisher();

        if (secretaryRole || lmmoRole || isElder || isMS || isPublisher) {
          handleCheckViewMeetingSchedule(false);
          setDisableViewMeetingRole(true);
        }

        isRoleCheckerRan = true;
      }
    }
  }, [member.cong_role, member.user_local_uid, handleCheckViewMeetingSchedule]);

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Typography sx={{ fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px outset', paddingBottom: '5px' }}>
        {t('roles')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={member.cong_role?.includes('admin') || false}
                disabled={member.global_role === 'pocket'}
                onChange={(e) => handleCheckAdmin(e.target.checked)}
              />
            }
            label={t('roleAdmin')}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={member.cong_role?.includes('coordinator') || false}
                disabled={member.global_role === 'pocket'}
                onChange={(e) => handleCheckCoordinator(e.target.checked)}
              />
            }
            label={t('roleCoordinator')}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={member.cong_role?.includes('secretary') || false}
                disabled={member.global_role === 'pocket'}
                onChange={(e) => handleCheckSecretary(e.target.checked)}
              />
            }
            label={t('roleSecretary')}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={member.cong_role?.includes('lmmo') || false}
                disabled={member.global_role === 'pocket'}
                onChange={(e) => handleCheckLMMO(e.target.checked)}
              />
            }
            label={t('roleLMMO')}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={member.cong_role?.includes('lmmo-backup') || false}
                disabled={member.global_role === 'pocket'}
                onChange={(e) => handleCheckLMMOAssistant(e.target.checked)}
              />
            }
            label={t('roleLMMOAssistant')}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={member.cong_role?.includes('public_talk_coordinator') || false}
                disabled={member.global_role === 'pocket'}
                onChange={(e) => handleCheckPublicTalkCoordinator(e.target.checked)}
              />
            }
            label={t('rolePublicTalkCoordinator')}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                disabled={disableViewMeetingRole}
                checked={member.cong_role?.includes('view_meeting_schedule') || false}
                onChange={(e) => handleCheckViewMeetingSchedule(e.target.checked)}
              />
            }
            label={t('roleViewMeetingSchedule')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CongregationPersonRoles;
