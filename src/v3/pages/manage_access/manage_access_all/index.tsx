import CustomButton from '@components/button';
import { IconAddPerson } from '@components/icons';
import {
  CustomDivider,
  DarkOverlay,
  PageTitle,
  UserAccountItem,
} from '@components/index';
import useAppTranslation from '@hooks/useAppTranslation';
import useBreakpoints from '@hooks/useBreakpoints';
import { Box } from '@mui/material';
import UsersContainer from './components/users_container';
import { useEffect, useState } from 'react';
import { MiniPerson } from './mini_person';
import {
  TestData__AppAdministrators,
  TestData__BaptizedBrothers,
  TestData__CongregationPersons,
} from './test_data';
import CustomTypography from '@components/typography';
import { disableWindowScroll, enableWindowScroll } from '@utils/scroll';
import AddANewOrganizedUserModalWindow from './add_a_new_organized_user_modal_window';
import useManageAccessAll from './useManageAccessAll';
// import ShareInvitationCodeModalWindow from './share_invitation_code_modal_window';

const ManageAccessAll = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { congregationPersons, baptizedBrothers } = useManageAccessAll();

  // TODO: Connect to API
  // TODO: Remove test data
  /* ----------------------------------- -- ----------------------------------- */
  const [congregationPersonsList, setCongregationPersons] = useState<
    MiniPerson[]
  >(() => congregationPersons);
  const [appAdministatorsList, setAppAdministratorsList] = useState<
    MiniPerson[]
  >(() => TestData__AppAdministrators);
  const [baptizedBrothersList, setBaptizedBrothersList] = useState<
    MiniPerson[]
  >(() => baptizedBrothers);
  /* ----------------------------------- -- ----------------------------------- */

  const [showCreateUserModalWindow, setShowCreateUserModalWindow] =
    useState(false);

  useEffect(() => {
    if (showCreateUserModalWindow) {
      disableWindowScroll();
    } else {
      enableWindowScroll();
    }
  }, [showCreateUserModalWindow]);

  return (
    <>
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <PageTitle
          title={t('tr_manageAccessFullTitle')}
          buttons={
            <CustomButton
              variant="main"
              startIcon={<IconAddPerson />}
              onClick={() => {
                setShowCreateUserModalWindow(true);
              }}
            >
              {t('tr_addUser')}
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
            <UsersContainer
              title={t('tr_congregationPersons')}
              description={t('tr_congregationPersonsDesc')}
              gap="24px"
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {congregationPersonsList.map((value) => {
                  const randomKey = crypto.randomUUID();
                  return (
                    <UserAccountItem
                      variant="user"
                      userName={value.username}
                      key={randomKey}
                    />
                  );
                })}
              </Box>
            </UsersContainer>
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
            <UsersContainer
              title={t('tr_baptizedAndAppointed')}
              description={t('tr_baptizedAndAppointedDesc')}
            >
              <CustomTypography
                className="body-small-semibold"
                color={'var(--black)'}
              >
                {t('tr_appAdministrators')}
              </CustomTypography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {appAdministatorsList.map((value) => {
                  const randomKey = crypto.randomUUID();
                  return (
                    <UserAccountItem
                      variant="admin"
                      userName={value.username}
                      key={randomKey}
                      userPosition={t(value.role)}
                    />
                  );
                })}
              </Box>

              <CustomDivider color="var(--accent-200)" />

              <CustomTypography
                className="body-small-semibold"
                color={'var(--black)'}
              >
                {t('tr_baptizedBrothers')}
              </CustomTypography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {baptizedBrothersList.map((value) => {
                  const randomKey = crypto.randomUUID();
                  return (
                    <UserAccountItem
                      variant="baptized"
                      userName={value.username}
                      key={randomKey}
                    />
                  );
                })}
              </Box>
            </UsersContainer>
          </Box>
        </Box>
      </Box>
      <DarkOverlay overlayIsOpened={showCreateUserModalWindow}>
        <AddANewOrganizedUserModalWindow
          onCancel={() => {
            setShowCreateUserModalWindow(false);
          }}
        />
        {/* <ShareInvitationCodeModalWindow name={'Mathoney Monday'} invitation_code={'UKR17038-V6VKVYUJAN6W'} /> */}
      </DarkOverlay>
    </>
  );
};

export default ManageAccessAll;
