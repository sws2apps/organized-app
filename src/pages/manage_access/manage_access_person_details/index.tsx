import PageTitle from '@components/page_title';
import { Box, InputAdornment } from '@mui/material';
import CustomButton from '@components/button';
import useAppTranslation from '@hooks/useAppTranslation';
import useBreakpoints from '@hooks/useBreakpoints';
import {
  IconCopy,
  IconDelete,
  IconInfo,
  IconInvite,
  IconSync,
} from '@components/icons';
import {
  StyledBoxForSwitches,
  StyledContainerForDetails,
} from './manage_access_person_details.styled';
import CustomTypography from '@components/typography';
import useManageAccessPersonDetails from './useManageAccessPersonDetails';
import CustomCheckbox from '@components/checkbox';
import CustomDivider from '@components/divider';
import CustomBoxWithSwitch from './components/custom_box_with_switch';
import CustomTextField from '@components/textfield';
import { StyledCustomIconButton } from '../manage_access_all/share_invitation_code_modal_window/share_invitation_code_modal_window.styled';
import SessionItem from '@features/my_profile/sessions/session_item';
import DelegatedPersons from './components/delegated_persons';

const ManageAccessPersonDetails = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { userName, userRights, invitationCode } =
    useManageAccessPersonDetails();

  const userRightsInfoDescription = (): string => {
    if (userRights == 'publisher') {
      return t('tr_publisherStatusDefault');
    }
    if (userRights == 'midweek-student') {
      return t('tr_midweekStudentStatusDefault');
    }
    if (userRights == 'administrator') {
      return t('tr_baptizedBrotherUserDesc');
    }
  };

  const copyButtonAction = () => {
    // TODO: Add Copy Button action
  };

  const syncButtonAction = () => {
    // TODO: Add Sync Button action
  };

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={userName}
        buttons={
          <CustomButton
            variant="main"
            startIcon={<IconDelete />}
            sx={{
              backgroundColor: 'var(--red-main)',

              '&:hover': {
                backgroundColor: 'var(--red-dark)',
              },
            }}
          >
            {t('tr_deleteUser')}
          </CustomButton>
        }
      />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexWrap: desktopUp ? 'nowrap' : 'wrap',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
            width: '100%',
            flexGrow: 1,
          }}
        >
          <StyledContainerForDetails>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <CustomTypography className="h2" color={'var(--black)'}>
                {t('tr_userRights')}
              </CustomTypography>

              <Box
                sx={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                {userRights != 'administrator' ? <IconInfo /> : null}
                <CustomTypography
                  className="body-regular"
                  color={'var(--grey-400)'}
                  dangerouslySetInnerHTML={{
                    __html: userRightsInfoDescription(),
                  }}
                />
              </Box>
            </Box>

            {userRights == 'administrator' ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <CustomTypography className="h4" color={'var(--grey-400)'}>
                  {t('tr_roles')}
                </CustomTypography>

                <CustomCheckbox
                  label={t('tr_coordinator')}
                  labelDescription={t('tr_coordinatorRoleDesc')}
                  sx={{
                    paddingLeft: '7px',
                  }}
                />

                <CustomCheckbox
                  label={t('tr_secretary')}
                  labelDescription={t('tr_secretaryRoleDesc')}
                  sx={{
                    paddingLeft: '7px',
                  }}
                />

                <CustomCheckbox
                  label={t('tr_appAdministrator')}
                  labelDescription={t('tr_appAdminRoleDesc')}
                  sx={{
                    paddingLeft: '7px',
                  }}
                />

                <CustomCheckbox
                  label={t('tr_serviceGroupOverseerOrAssistantRole')}
                  labelDescription={t('tr_serviceGroupOverseerRoleDesc')}
                  sx={{
                    paddingLeft: '7px',
                  }}
                />

                <CustomDivider color="var(--accent-200)" />

                <CustomTypography className="h4" color={'var(--grey-400)'}>
                  {t('tr_additionalUserRights')}
                </CustomTypography>

                <StyledBoxForSwitches>
                  <CustomTypography
                    className="body-small-semibold"
                    color={'var(--grey-400)'}
                  >
                    {t('tr_meetings')}
                  </CustomTypography>

                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_midweekMeetingScheduling')}
                  />
                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_weekendMeetingScheduling')}
                  />
                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_meetingDutiesScheduling')}
                  />
                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_attendanceRecordTracking')}
                  />
                </StyledBoxForSwitches>

                <StyledBoxForSwitches>
                  <CustomTypography
                    className="body-small-semibold"
                    color={'var(--grey-400)'}
                  >
                    {t('tr_congregation')}
                  </CustomTypography>

                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_literatureManagement')}
                  />
                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_informationBoardEditing')}
                  />
                </StyledBoxForSwitches>

                <StyledBoxForSwitches>
                  <CustomTypography
                    className="body-small-semibold"
                    color={'var(--grey-400)'}
                  >
                    {t('tr_service')}
                  </CustomTypography>

                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_fieldServiceMeetingsScheduling')}
                  />

                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_publicWitnessingScheduling')}
                  />

                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_congregationTerritoriesManagement')}
                  />
                </StyledBoxForSwitches>

                <StyledBoxForSwitches>
                  <CustomTypography
                    className="body-small-semibold"
                    color={'var(--grey-400)'}
                  >
                    {t('tr_events')}
                  </CustomTypography>

                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_coVisitScheduling')}
                  />
                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_congregationActivitiesScheduling')}
                  />
                  <CustomBoxWithSwitch
                    checked={true}
                    onChange={() => {
                      throw new Error('Function not implemented.');
                    }}
                    label={t('tr_hallCleaningScheduling')}
                  />
                </StyledBoxForSwitches>
              </Box>
            ) : null}
          </StyledContainerForDetails>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
            width: '100%',
            flexGrow: 1,
          }}
        >
          <StyledContainerForDetails>
            <CustomTypography className="h2" color={'var(--black)'}>
              {t('tr_profileSettings')}
            </CustomTypography>

            <CustomTextField select label={t('tr_bindWithRecord')} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <CustomTypography className="h2" color={'var(--black)'}>
                {t('tr_delegatePersons')}
              </CustomTypography>
              <CustomTypography
                className="body-regular"
                color={'var(--grey-400)'}
              >
                {t('tr_delegatePersonsDesc')}
              </CustomTypography>
            </Box>
            <DelegatedPersons
              persons={[
                'Craig Federighi',
                'John Smith',
                'Emily Johnson',
                'Michael Brown',
                'Sarah Davis',
                'David Wilson',
                'Jessica Martinez',
                'Christopher Taylor',
                'Amanda Anderson',
                'Daniel Thomas',
              ]}
            />
          </StyledContainerForDetails>

          <StyledContainerForDetails>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <CustomTypography className="h2" color={'var(--black)'}>
                {t('tr_invitationCode')}
              </CustomTypography>
              <CustomTypography
                className="body-regular"
                color={'var(--grey-400)'}
                dangerouslySetInnerHTML={{
                  __html: t('tr_invitationCodeInstruction'),
                }}
              />
            </Box>
            {invitationCode ? (
              <>
                <CustomTextField
                  value={invitationCode}
                  label={t('tr_invitationCode')}
                  endAdornment={
                    <InputAdornment
                      position="end"
                      sx={{
                        position: 'relative',
                        right: '-12px',
                        gap: '16px',
                      }}
                    >
                      <StyledCustomIconButton
                        onClick={syncButtonAction}
                        title={t('tr_sync')}
                      >
                        <IconSync color="var(--accent-400)" />
                      </StyledCustomIconButton>
                      <StyledCustomIconButton
                        onClick={copyButtonAction}
                        title={t('tr_copy')}
                      >
                        <IconCopy color="var(--accent-400)" />
                      </StyledCustomIconButton>
                    </InputAdornment>
                  }
                />
                <CustomButton
                  variant="tertiary"
                  sx={{
                    color: 'var(--red-main)',
                    border: '1px solid var(--red-main)',

                    '&:hover': {
                      backgroundColor: 'var(--red-main)',
                      color: 'var(--white)',
                      border: '1px solid var(--red-main)',
                    },
                  }}
                >
                  {t('tr_deleteInvitationCode')}
                </CustomButton>
              </>
            ) : (
              <CustomButton variant="tertiary" startIcon={<IconInvite />}>
                {t('tr_generateInvitationCode')}
              </CustomButton>
            )}
          </StyledContainerForDetails>
          <StyledContainerForDetails>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <CustomTypography className="h2" color={'var(--black)'}>
                {t('tr_sessions')}
              </CustomTypography>
              <CustomTypography
                className="body-regular"
                color={'var(--grey-400)'}
              >
                {t('tr_terminateSessionAdminDesc')}
              </CustomTypography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <SessionItem
                session={{
                  identifier: '',
                  isSelf: false,
                  ip: '2.109.43.16',
                  country_name: 'Germany',
                  device: {
                    browserName: 'Safari (16.6)',
                    os: 'macOs 14.5 (Sonoma)',
                    isMobile: false,
                  },
                  last_seen: 0,
                }}
              />
            </Box>
          </StyledContainerForDetails>
        </Box>
      </Box>
    </Box>
  );
};

export default ManageAccessPersonDetails;
