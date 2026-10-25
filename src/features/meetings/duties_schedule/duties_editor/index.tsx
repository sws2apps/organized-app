import { useId } from 'react';
import { Box, Stack } from '@mui/material';
import {
  IconAtHome,
  IconComputerVideo,
  IconConference,
  IconDoor,
  IconDuties,
  IconHallOverseer,
  IconMicrophone,
  IconTalk,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useDutiesEditor from '@features/meetings/duties_schedule/duties_editor/useDutiesEditor';
import { DutiesMeetingValue } from '@services/app/duties';
import Divider from '@components/divider';
import DutyRow from '@features/meetings/duties_schedule/duty_row';
import Badge from '@components/badge';
import DateNavigator from '@components/date_navigator';
import InfoNote from '@components/info_note';
import MicSections from '@features/meetings/duties_schedule/mic_sections';
import TabSwitcher from '@components/tab_switcher';
import Typography from '@components/typography';

const DutiesEditor = () => {
  const { t } = useAppTranslation();
  const tabId = useId();

  const { tablet500Down, laptopDown } = useBreakpoints();

  const {
    weekDateLocale,
    isCurrentWeek,
    activeMeeting,
    selectedWeek,
    showWeekNav,
    activePrefix,
    micSectionsEnabled,
    meetingsInfo,
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
                    icon={<IconDuties color="var(--accent-dark)" />}
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

  const panelId = `${tabId}-panel`;
  const status = meetingStatus[activeMeeting];

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
        <Stack spacing="16px">
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--dialog-gap-mobile)',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <DateNavigator
              value={weekDateLocale}
              onBack={handleChangeWeekBack}
              onNext={handleChangeWeekNext}
              disableBack={!showWeekNav.back}
              disableNext={!showWeekNav.next}
              badgeText={t('tr_today')}
              badgeVisible={isCurrentWeek}
              sx={{
                width: tablet500Down ? '100%' : 'auto',
                minWidth: 0,
                maxWidth: '100%',
              }}
            />
            <TabSwitcher<DutiesMeetingValue>
              id={tabId}
              wrapLabels
              value={activeMeeting}
              onChange={handleChangeMeeting}
              ariaLabel={t('tr_meetingDutiesSchedules')}
              options={(['midweek', 'weekend'] as const).map((meeting) => ({
                value: meeting,
                label: t(meeting === 'midweek' ? 'tr_midweek' : 'tr_weekend'),
                panelId,
                badge: (
                  <Badge
                    size="small"
                    color={activeMeeting === meeting ? 'accent' : 'grey'}
                    text={`${meetingsInfo[meeting].assigned}/${meetingsInfo[meeting].total}`}
                  />
                ),
              }))}
              sx={{
                width: tablet500Down ? '100%' : 'auto',
                maxWidth: '100%',
                marginInlineStart: 'auto',
                display: tablet500Down ? 'flex' : 'inline-grid',
                gridAutoFlow: 'column',
                gridAutoColumns: 'minmax(max-content, 1fr)',
                '& [role="tab"]': { minHeight: '44px' },
              }}
            />
          </Box>
          <Box
            role="tabpanel"
            id={panelId}
            aria-labelledby={`${tabId}-${activeMeeting}`}
            tabIndex={0}
            sx={{ minWidth: 0 }}
          >
            {status !== 'held' ? (
              <InfoNote
                message={t(
                  status === 'missing-materials'
                    ? 'tr_dutiesMaterialsRequired'
                    : 'tr_noMeeting'
                )}
              />
            ) : !hasAudio && !hasHall && !hasOther ? (
              <InfoNote message={t('tr_dutiesNoSlots')} />
            ) : (
              dutiesPanel(activeMeeting)
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default DutiesEditor;
