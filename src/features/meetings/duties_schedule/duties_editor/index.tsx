import { useId } from 'react';
import { Box, Stack } from '@mui/material';
import {
  IconAtHome,
  IconComputerVideo,
  IconConference,
  IconDoor,
  IconCustomDuty,
  IconHallOverseer,
  IconMicrophone,
  IconTalk,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useDutiesEditor from '@features/meetings/duties_schedule/duties_editor/useDutiesEditor';
import { DutiesMeetingValue } from '@services/app/duties';
import Divider from '@components/divider';
import DutyRow from '@features/meetings/duties_schedule/duty_row';
import DateNavigator from '@components/date_navigator';
import InfoNote from '@components/info_note';
import MicSections from '@features/meetings/duties_schedule/mic_sections';
import TabSwitcher from '@components/tab_switcher';
import Typography from '@components/typography';

const DutiesEditor = () => {
  const { t } = useAppTranslation();
  const tabsId = useId();

  const { tablet500Down, laptopDown } = useBreakpoints();

  const {
    dataView,
    weekly,
    weekDateLocale,
    isCurrentWeek,
    activeMeeting,
    selectedWeek,
    showWeekNav,
    activePrefix,
    micSectionsEnabled,
    meetingStatus,
    dutyRows,
    handleChangeMeeting,
    handleChangeWeekBack,
    handleChangeWeekNext,
  } = useDutiesEditor();

  // mobile: dividers tie each chip to its own fields below
  const rowDivider = laptopDown ? (
    <Divider color="var(--accent-200)" />
  ) : undefined;

  const hasAudio =
    micSectionsEnabled ||
    dutyRows.audioVideo.some((column) => column.length) ||
    dutyRows.microphones.length > 0 ||
    dutyRows.stage.length > 0;
  const hasHall =
    dutyRows.entranceAttendant.length > 0 ||
    dutyRows.auditoriumAttendant.length > 0;
  const hasOther =
    dutyRows.hospitality.length > 0 ||
    dutyRows.videoconferenceHost.length > 0 ||
    dutyRows.custom.some((duty) => duty.fields.length > 0);

  const dutiesPanel = (meeting: DutiesMeetingValue) => (
    <Stack spacing="16px" key={meeting}>
      {hasAudio && (
        <Stack spacing="12px">
          <Typography className="h4">{t('tr_dutiesAudio')}</Typography>

          <Stack spacing="16px" divider={rowDivider}>
            {dutyRows.audioVideo.some((column) => column.length > 0) && (
              <DutyRow
                duty={t('tr_audioVideo')}
                icon={<IconComputerVideo color="var(--accent-dark)" />}
                week={selectedWeek}
                columns={dutyRows.audioVideo}
              />
            )}

            {micSectionsEnabled && (
              <DutyRow
                duty={t('tr_dutiesMicrophones')}
                icon={<IconMicrophone color="var(--accent-dark)" />}
                week={selectedWeek}
              >
                <MicSections
                  key={`${selectedWeek}:${meeting}:${dataView}`}
                  week={selectedWeek}
                  prefix={activePrefix}
                  meeting={meeting}
                />
              </DutyRow>
            )}

            {!micSectionsEnabled && dutyRows.microphones.length > 0 && (
              <DutyRow
                duty={t('tr_dutiesMicrophones')}
                icon={<IconMicrophone color="var(--accent-dark)" />}
                week={selectedWeek}
                fields={dutyRows.microphones}
              />
            )}

            {dutyRows.stage.length > 0 && (
              <DutyRow
                duty={t('tr_dutiesStage')}
                icon={<IconTalk color="var(--accent-dark)" />}
                week={selectedWeek}
                fields={dutyRows.stage}
              />
            )}
          </Stack>
        </Stack>
      )}

      {hasAudio && hasHall && <Divider color="var(--accent-200)" />}

      {hasHall && (
        <Stack spacing="12px">
          <Typography className="h4">{t('tr_hall')}</Typography>

          <Stack spacing="16px" divider={rowDivider}>
            {dutyRows.entranceAttendant.length > 0 && (
              <DutyRow
                duty={t('tr_dutiesEntranceAttendant')}
                icon={<IconDoor color="var(--accent-dark)" />}
                week={selectedWeek}
                fields={dutyRows.entranceAttendant}
              />
            )}

            {dutyRows.auditoriumAttendant.length > 0 && (
              <DutyRow
                duty={t('tr_dutiesAuditoriumAttendant')}
                icon={<IconHallOverseer color="var(--accent-dark)" />}
                week={selectedWeek}
                fields={dutyRows.auditoriumAttendant}
              />
            )}
          </Stack>
        </Stack>
      )}

      {hasOther && (
        <>
          {(hasAudio || hasHall) && <Divider color="var(--accent-200)" />}

          <Stack spacing="12px">
            <Typography className="h4">{t('tr_otherPart')}</Typography>

            <Stack spacing="16px" divider={rowDivider}>
              {dutyRows.hospitality.length > 0 && (
                <DutyRow
                  duty={t('tr_hospitality')}
                  icon={<IconAtHome color="var(--accent-dark)" />}
                  week={selectedWeek}
                  fields={dutyRows.hospitality}
                />
              )}

              {dutyRows.videoconferenceHost.length > 0 && (
                <DutyRow
                  duty={t('tr_dutiesVideoconferenceHost')}
                  icon={<IconConference color="var(--accent-dark)" />}
                  week={selectedWeek}
                  fields={dutyRows.videoconferenceHost}
                />
              )}

              {dutyRows.custom
                .filter((duty) => duty.fields.length > 0)
                .map((duty) => (
                  <DutyRow
                    key={duty.id}
                    duty={duty.name}
                    icon={<IconCustomDuty icon={duty.icon} />}
                    week={selectedWeek}
                    fields={duty.fields}
                  />
                ))}
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );

  const meetingPanel = (meeting: DutiesMeetingValue) => {
    const status = meetingStatus[meeting];
    if (status !== 'held') {
      return (
        <InfoNote
          message={t(
            status === 'missing-materials'
              ? 'tr_dutiesMaterialsRequired'
              : 'tr_noMeeting'
          )}
        />
      );
    }
    if (!hasAudio && !hasHall && !hasOther) {
      return <InfoNote message={t('tr_dutiesNoSlots')} />;
    }
    return dutiesPanel(meeting);
  };

  const dateNavigator = (
    <DateNavigator
      value={weekDateLocale}
      labelMinWidth={
        tablet500Down ? undefined : 'var(--date-navigator-label-min-width)'
      }
      onBack={handleChangeWeekBack}
      onNext={handleChangeWeekNext}
      disableBack={!showWeekNav.back}
      disableNext={!showWeekNav.next}
      badgeText={t('tr_today')}
      badgeVisible={isCurrentWeek}
      sx={{
        width: tablet500Down ? '100%' : 'fit-content',
        alignSelf: 'flex-start',
        minWidth: 0,
        maxWidth: '100%',
      }}
    />
  );

  return (
    <Box
      sx={{
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--dialog-gap-mobile)',
        marginBottom: laptopDown ? '96px' : 0,
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        flexGrow: 1,
        minWidth: 0,
      }}
    >
      {!selectedWeek ? (
        <InfoNote message={t('tr_infoPlanMeetingDuties')} />
      ) : (
        <Stack spacing="24px">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--dialog-gap-mobile)',
            }}
          >
            {dateNavigator}
            {!weekly && (
              <TabSwitcher<DutiesMeetingValue>
                id={tabsId}
                ariaLabel={t('tr_meetings')}
                surface="light"
                wrapLabels
                value={activeMeeting}
                onChange={handleChangeMeeting}
                options={[
                  {
                    value: 'midweek',
                    label: t('tr_midweek'),
                    panelId: `${tabsId}-panel`,
                  },
                  {
                    value: 'weekend',
                    label: t('tr_weekend'),
                    panelId: `${tabsId}-panel`,
                  },
                ]}
                sx={{
                  width: tablet500Down
                    ? '100%'
                    : 'var(--duties-meeting-switch-width)',
                  flexShrink: 0,
                  marginInlineStart: 'auto',
                  maxWidth: '100%',
                }}
              />
            )}
          </Box>
          <Box
            role={weekly ? undefined : 'tabpanel'}
            id={weekly ? undefined : `${tabsId}-panel`}
            aria-labelledby={weekly ? undefined : `${tabsId}-${activeMeeting}`}
          >
            {meetingPanel(activeMeeting)}
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default DutiesEditor;
