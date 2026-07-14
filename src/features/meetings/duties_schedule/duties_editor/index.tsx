import { Box, Stack } from '@mui/material';
import {
  IconAtHome,
  IconComputerVideo,
  IconDoor,
  IconEdit,
  IconHallOverseer,
  IconMicrophone,
  IconNavigateLeft,
  IconNavigateRight,
  IconTalk,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useDutiesEditor, { DutiesMeetingValue } from './useDutiesEditor';
import Divider from '@components/divider';
import DutyName from '../duty_name';
import DutyRow from '../duty_row';
import IconButton from '@components/icon_button';
import InfoTip from '@components/info_tip';
import MicSections from '../mic_sections';
import Tabs from '@components/tabs';
import Typography from '@components/typography';

const TabLabel = ({
  label,
  assigned,
  total,
}: {
  label: string;
  assigned: number;
  total: number;
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    {label}
    <Box
      sx={{
        backgroundColor: 'var(--accent-150)',
        borderRadius: '4px',
        padding: '2px 6px',
      }}
    >
      <Typography className="body-small-semibold" color="var(--accent-dark)">
        {assigned}/{total}
      </Typography>
    </Box>
  </Box>
);

const DutiesEditor = () => {
  const { t } = useAppTranslation();

  const { tablet500Down, laptopDown } = useBreakpoints();

  const {
    weekDateLocale,
    selectedWeek,
    showWeekNav,
    activePrefix,
    micSectionsEnabled,
    meetingsInfo,
    dutyRows,
    handleChangeMeeting,
    handleChangeWeekBack,
    handleChangeWeekNext,
  } = useDutiesEditor();

  const dutiesPanel = (meeting: DutiesMeetingValue) => (
    <Stack spacing="16px" key={meeting}>
      {/* audio video duties */}
      <Stack spacing="12px">
        <Typography className="h4">{t('tr_dutiesAudio')}</Typography>

        {dutyRows.audioVideo.length > 0 && (
          <DutyRow
            duty={t('tr_audioVideo')}
            icon={<IconComputerVideo color="var(--accent-dark)" />}
            week={selectedWeek}
            fields={dutyRows.audioVideo}
          />
        )}

        {micSectionsEnabled && (
          <Stack
            spacing={laptopDown ? '24px' : '8px'}
            direction={laptopDown ? 'column' : 'row'}
            alignItems="flex-start"
          >
            <DutyName
              duty={t('tr_dutiesMicrophones')}
              icon={<IconMicrophone color="var(--accent-dark)" />}
            />
            <MicSections week={selectedWeek} prefix={activePrefix} />
          </Stack>
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

      <Divider color="var(--accent-200)" />

      {/* attendants duties */}
      <Stack spacing="12px">
        <Typography className="h4">{t('tr_hall')}</Typography>

        {dutyRows.entranceAttendant.length > 0 && (
          <DutyRow
            duty={t('tr_dutiesEntranceAttendant')}
            icon={<IconDoor color="var(--accent-dark)" />}
            week={selectedWeek}
            fields={dutyRows.entranceAttendant}
          />
        )}

        <DutyRow
          duty={t('tr_dutiesAuditoriumAttendant')}
          icon={<IconHallOverseer color="var(--accent-dark)" />}
          week={selectedWeek}
          fields={dutyRows.auditoriumAttendant}
        />
      </Stack>

      {(dutyRows.hospitality.length > 0 || dutyRows.custom.length > 0) && (
        <>
          <Divider color="var(--accent-200)" />

          {/* other duties */}
          <Stack spacing="12px">
            <Typography className="h4">{t('tr_otherPart')}</Typography>

            {dutyRows.hospitality.length > 0 && (
              <DutyRow
                duty={t('tr_hospitality')}
                icon={<IconAtHome color="var(--accent-dark)" />}
                week={selectedWeek}
                fields={dutyRows.hospitality}
              />
            )}

            {dutyRows.custom.map((duty) => (
              <DutyRow
                key={duty.id}
                duty={duty.name}
                icon={<IconEdit color="var(--accent-dark)" />}
                week={selectedWeek}
                fields={duty.fields}
              />
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );

  return (
    <Box
      sx={{
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        flexGrow: 1,
      }}
    >
      {weekDateLocale.length === 0 && (
        <InfoTip isBig={false} color="blue" text={t('tr_infoPlanMeetingDuties')} />
      )}

      {weekDateLocale.length > 0 && (
        <Tabs
          tabs={[
            {
              label: (
                <TabLabel
                  label={t('tr_midweekMeeting')}
                  assigned={meetingsInfo.midweek.assigned}
                  total={meetingsInfo.midweek.total}
                />
              ),
              Component: dutiesPanel('midweek'),
            },
            {
              label: (
                <TabLabel
                  label={t('tr_weekendMeeting')}
                  assigned={meetingsInfo.weekend.assigned}
                  total={meetingsInfo.weekend.total}
                />
              ),
              Component: dutiesPanel('weekend'),
            },
          ]}
          onChange={handleChangeMeeting}
          actionComponent={
            <Stack
              direction="row"
              spacing="16px"
              alignItems="center"
              justifyContent={tablet500Down && 'space-between'}
            >
              <IconButton
                disabled={!showWeekNav.back}
                onClick={handleChangeWeekBack}
                sx={{ padding: '2px' }}
              >
                <IconNavigateLeft
                  color={showWeekNav.back ? 'var(--black)' : 'var(--grey-300)'}
                />
              </IconButton>

              <Typography
                className="h2"
                sx={{
                  minWidth: !tablet500Down && '140px',
                  textAlign: 'center',
                }}
              >
                {weekDateLocale}
              </Typography>

              <IconButton
                disabled={!showWeekNav.next}
                onClick={handleChangeWeekNext}
                sx={{ padding: '2px' }}
              >
                <IconNavigateRight
                  color={showWeekNav.next ? 'var(--black)' : 'var(--grey-300)'}
                />
              </IconButton>
            </Stack>
          }
        />
      )}
    </Box>
  );
};

export default DutiesEditor;
