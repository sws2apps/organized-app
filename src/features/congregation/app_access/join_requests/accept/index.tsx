import { Box, Stack } from '@mui/material';
import { IconCheck, IconLoading } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { AcceptRequestProps, UsersOption } from './index.types';
import { SwitchContainer } from '../../user_details/shared_styles';
import useAcceptRequest from './useAccept';
import Autocomplete from '@components/autocomplete';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Dialog from '@components/dialog';
import SwitchWithLabel from '@components/switch_with_label';
import Typography from '@components/typography';

const AcceptRequest = (props: AcceptRequestProps) => {
  const { t } = useAppTranslation();

  const { isLoading, fullname } = props;

  const {
    handleClose,
    handleConfirm,
    handleOpen,
    open,
    options,
    selectedPerson,
    setSelectedPerson,
    handleRolesChange,
    roles,
  } = useAcceptRequest(props);

  return (
    <>
      <Button
        sx={{ height: '32px', minHeight: '32px' }}
        className={'body-small-semibold'}
        startIcon={
          isLoading ? (
            <IconLoading color="accent" />
          ) : (
            <IconCheck color={'accent'} />
          )
        }
        variant={'secondary'}
        onClick={handleOpen}
      >
        {t('tr_accept')}
      </Button>

      <Dialog onClose={handleClose} open={open} sx={{ padding: '24px' }}>
        <Typography className="h2">
          {t('tr_joinRequestsAccept', { user: fullname })}
        </Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          {t('tr_joinRequestsAcceptDesc')}
        </Typography>

        <Stack spacing="24px" sx={{ maxHeight: '300px', overflow: 'auto' }}>
          <Autocomplete
            label={t('tr_bindWithRecord')}
            options={options}
            getOptionLabel={(option: UsersOption) => option.person_name}
            isOptionEqualToValue={(option, value) =>
              option.person_uid === value.person_uid
            }
            value={selectedPerson}
            onChange={(_, value: UsersOption) => setSelectedPerson(value)}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{ margin: 0, padding: 0 }}
                key={option.person_uid}
              >
                <Typography>{option.person_name}</Typography>
              </Box>
            )}
          />

          <Stack spacing="12px">
            <Typography className="h4" color="var(--grey-400)">
              {t('tr_roles')}
            </Typography>

            <Checkbox
              label={t('tr_coordinator')}
              labelDescription={t('tr_coordinatorRoleDesc')}
              checked={roles.includes('coordinator')}
              onChange={(_, checked) =>
                handleRolesChange('coordinator', checked)
              }
            />

            <Checkbox
              label={t('tr_secretary')}
              labelDescription={t('tr_secretaryRoleDesc')}
              checked={roles.includes('secretary')}
              onChange={(_, checked) => handleRolesChange('secretary', checked)}
            />

            <Checkbox
              label={t('tr_appAdministrator')}
              labelDescription={t('tr_appAdminRoleDesc')}
              checked={roles.includes('admin')}
              onChange={(_, checked) => handleRolesChange('admin', checked)}
            />

            <Checkbox
              label={t('tr_serviceOverseer')}
              labelDescription={t('tr_serviceOverseerRoleDesc')}
              checked={roles.includes('service_overseer')}
              onChange={(_, checked) =>
                handleRolesChange('service_overseer', checked)
              }
            />
          </Stack>

          <Stack spacing="12px">
            <Typography className="h4" color="var(--grey-400)">
              {t('tr_additionalUserRights')}
            </Typography>

            <SwitchContainer>
              <SwitchWithLabel
                label={t('tr_midweekMeetingScheduling')}
                checked={roles.includes('midweek_schedule')}
                onChange={(checked) =>
                  handleRolesChange('midweek_schedule', checked)
                }
              />

              <SwitchWithLabel
                label={t('tr_weekendMeetingScheduling')}
                checked={roles.includes('weekend_schedule')}
                onChange={(checked) =>
                  handleRolesChange('weekend_schedule', checked)
                }
              />

              <SwitchWithLabel
                label={t('tr_publicTalkScheduling')}
                checked={roles.includes('public_talk_schedule')}
                onChange={(checked) =>
                  handleRolesChange('public_talk_schedule', checked)
                }
              />

              <SwitchWithLabel
                label={t('tr_attendanceRecordTracking')}
                checked={roles.includes('attendance_tracking')}
                onChange={(checked) =>
                  handleRolesChange('attendance_tracking', checked)
                }
              />
            </SwitchContainer>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
          }}
        >
          <Button variant="main" onClick={handleConfirm}>
            {t('tr_continue')}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            {t('tr_cancel')}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AcceptRequest;
