import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useVolunteerActivities from './useVolunteerActivities';
import EditActivity from '@features/activities/volunteer_activities/edit_activity';
import InfoNote from '@components/info_note';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import VolunteerActivity from '@features/activities/volunteer_activities/volunteer_activity';

const VolunteerActivities = () => {
  const { t } = useAppTranslation();
  const { tablet688Up } = useBreakpoints();

  const {
    isAdmin,
    activities,
    emptyActivity,
    isAdding,
    handleShowAdd,
    handleHideAdd,
    handleSaveActivity,
  } = useVolunteerActivities();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      <PageTitle
        title={t('tr_volunteerActivities')}
        buttons={
          isAdmin && (
            <NavBarButtonGroup>
              <NavBarButton
                text={t('tr_add')}
                icon={<IconAdd />}
                onClick={handleShowAdd}
              />
            </NavBarButtonGroup>
          )
        }
      />

      {isAdding && (
        <EditActivity
          data={emptyActivity}
          type="add"
          participantsCount={0}
          onSave={handleSaveActivity}
          onCancel={handleHideAdd}
        />
      )}

      {activities.length === 0 && !isAdding && (
        <InfoNote
          variant="card"
          message={t(
            isAdmin
              ? 'tr_volunteerActivitiesEmptyAdmin'
              : 'tr_volunteerActivitiesEmpty'
          )}
        />
      )}

      {activities.map((activity) => (
        <VolunteerActivity key={activity.activity_uid} data={activity} />
      ))}
    </Box>
  );
};

export default VolunteerActivities;
