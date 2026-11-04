import { useAtomValue } from 'jotai';
import { userDataViewState } from '@states/settings';
import { useState } from 'react';
import CampaignOverview from '@features/territories/components/campaign_overview';
import { UpcomingEventType } from '@definition/upcoming_events';
import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useUpcomingEvents from './useUpcomingEvents';
import EditUpcomingEvent from '@features/activities/upcoming_events/edit_upcoming_event';
import PageTitle from '@components/page_title';
import QuickSettingsUpcomingEvents from '@features/activities/upcoming_events/quick_settings';
import UpcomingEventsList from '@features/activities/upcoming_events/upcoming_events_list';
import ExportUpcomingEvents from '@features/activities/upcoming_events/export_upcoming_events';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';

const UpcomingEvents = () => {
  const { t } = useAppTranslation();
  const dataView = useAtomValue(userDataViewState);
  const { tablet688Up } = useBreakpoints();

  const {
    isAdmin,
    campaignsOnly,
    emptyEvent,
    events,
    handleAddEventButtonClick,
    handleHideAddEventBox,
    addEventBoxShow,
    handleSaveEvent,
    quickSettingsOpen,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
  } = useUpcomingEvents();

  const [editing, setEditing] = useState<UpcomingEventType>();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      {quickSettingsOpen && (
        <QuickSettingsUpcomingEvents
          open={quickSettingsOpen}
          onClose={handleCloseQuickSettings}
        />
      )}

      <PageTitle
        title={t(campaignsOnly ? 'tr_territoryCampaigns' : 'tr_upcomingEvents')}
        quickSettings={isAdmin ? handleOpenQuickSettings : undefined}
        buttons={
          isAdmin &&
          !editing &&
          !addEventBoxShow && (
            <NavBarButtonGroup>
              {!campaignsOnly && <ExportUpcomingEvents />}
              <NavBarButton
                text={t('tr_add')}
                icon={<IconAdd />}
                onClick={handleAddEventButtonClick}
              ></NavBarButton>
            </NavBarButtonGroup>
          )
        }
      />

      {editing && (
        <EditUpcomingEvent
          data={editing}
          type="edit"
          onCancel={() => setEditing(undefined)}
          onSave={async (event) => {
            if (await handleSaveEvent(event)) setEditing(undefined);
          }}
        />
      )}
      {addEventBoxShow && (
        <EditUpcomingEvent
          data={emptyEvent}
          type="add"
          onSave={handleSaveEvent}
          onCancel={handleHideAddEventBox}
        />
      )}

      {campaignsOnly ? (
        !addEventBoxShow &&
        !editing && (
          <CampaignOverview
            editableIds={events
              .filter((event) => event.event_data.type === dataView)
              .map((event) => event.event_uid)}
            onEdit={
              isAdmin
                ? (campaign) =>
                    setEditing(
                      events.find((event) => event.event_uid === campaign.id)
                    )
                : undefined
            }
          />
        )
      ) : (
        <UpcomingEventsList data={events} isAdding={addEventBoxShow} />
      )}
    </Box>
  );
};

export default UpcomingEvents;
