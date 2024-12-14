import { Box, Grid2 as Grid, Stack } from '@mui/material';
import { IconImportJson, IconLoading } from '@components/icons';
import { ConfirmImportProps } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useConfirmImport from './useConfirmImport';
import Button from '@components/button';
import Divider from '@components/divider';
import Typography from '@components/typography';
import Checkbox from '@components/checkbox';

const ConfirmImport = (props: ConfirmImportProps) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const {
    filename,
    isProcessing,
    handleImportData,
    persons,
    handleSelectData,
    selected,
    field_service_groups,
    visiting_speakers,
    user_field_service_reports,
    cong_field_service_reports,
    meeting_attendance,
    schedules,
    selectedAll,
    inderterminate,
    handleSelectAll,
  } = useConfirmImport();

  return (
    <Stack spacing="16px">
      <Typography className="h2">{t('tr_importDataConfirm')}</Typography>

      <Typography color="var(--grey-400)">
        {t('tr_importDataConfirmDesc')}
      </Typography>

      <Stack
        spacing="16px"
        padding="16px"
        borderRadius="var(--radius-m)"
        bgcolor="var(--accent-150)"
        divider={<Divider color="var(--accent-200)" />}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconImportJson />
          <Typography className="h4" color="var(--accent-dark)">
            {filename}
          </Typography>
        </Box>

        <Stack spacing="8px">
          <Checkbox
            checked={selectedAll}
            indeterminate={inderterminate}
            onChange={handleSelectAll}
            label={
              <Typography
                className="body-small-semibold"
                color="var(--accent-dark)"
              >
                {t('tr_selectAll')}
              </Typography>
            }
          />

          <Grid
            container
            spacing={tabletDown ? 0 : 2}
            sx={{ marginLeft: '4px !important' }}
          >
            <Grid size={{ mobile: 12, tablet: 6 }}>
              <Checkbox
                checked={selected.persons}
                disabled={persons.length === 0}
                onChange={(_, checked) => handleSelectData('persons', checked)}
                label={
                  <Typography
                    className="body-small-regular"
                    color="var(--accent-dark)"
                  >
                    {t('tr_persons')}
                  </Typography>
                }
              />

              <Checkbox
                checked={selected.field_service_groups}
                disabled={field_service_groups.length === 0}
                onChange={(_, checked) =>
                  handleSelectData('field_service_groups', checked)
                }
                label={
                  <Typography
                    className="body-small-regular"
                    color="var(--accent-dark)"
                  >
                    {t('tr_fieldServiceGroups')}
                  </Typography>
                }
              />

              <Checkbox
                checked={selected.visiting_speakers}
                disabled={visiting_speakers.length === 0}
                onChange={(_, checked) =>
                  handleSelectData('visiting_speakers', checked)
                }
                label={
                  <Typography
                    className="body-small-regular"
                    color="var(--accent-dark)"
                  >
                    {t('tr_visitingSpeakers')}
                  </Typography>
                }
              />

              <Checkbox
                checked={selected.user_field_service_reports}
                disabled={user_field_service_reports.length === 0}
                onChange={(_, checked) =>
                  handleSelectData('user_field_service_reports', checked)
                }
                label={
                  <Typography
                    className="body-small-regular"
                    color="var(--accent-dark)"
                  >
                    {t('tr_ministryReports')}
                  </Typography>
                }
              />
            </Grid>

            <Grid size={{ mobile: 12, tablet: 6 }}>
              <Checkbox
                checked={selected.cong_field_service_reports}
                disabled={cong_field_service_reports.length === 0}
                onChange={(_, checked) =>
                  handleSelectData('cong_field_service_reports', checked)
                }
                label={
                  <Typography
                    className="body-small-regular"
                    color="var(--accent-dark)"
                  >
                    {t('tr_congregationReports')}
                  </Typography>
                }
              />
              <Checkbox
                checked={selected.meeting_attendance}
                disabled={meeting_attendance.length === 0}
                onChange={(_, checked) =>
                  handleSelectData('meeting_attendance', checked)
                }
                label={
                  <Typography
                    className="body-small-regular"
                    color="var(--accent-dark)"
                  >
                    {t('tr_recordAttendance')}
                  </Typography>
                }
              />

              <Checkbox
                checked={selected.midweek_history}
                disabled={schedules.length === 0}
                onChange={(_, checked) =>
                  handleSelectData('midweek_history', checked)
                }
                label={
                  <Typography
                    className="body-small-regular"
                    color="var(--accent-dark)"
                  >
                    {t('tr_midweekMeetingHistory')}
                  </Typography>
                }
              />

              <Checkbox
                checked={selected.weekend_history}
                disabled={schedules.length === 0}
                onChange={(_, checked) =>
                  handleSelectData('weekend_history', checked)
                }
                label={
                  <Typography
                    className="body-small-regular"
                    color="var(--accent-dark)"
                  >
                    {t('tr_weekendMeetingHistory')}
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </Stack>
      </Stack>

      <Stack spacing="8px">
        <Button
          variant="main"
          onClick={handleImportData}
          endIcon={isProcessing && <IconLoading />}
        >
          {t('tr_import')}
        </Button>
        <Button variant="secondary" onClick={props.onBack}>
          {t('tr_back')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ConfirmImport;
