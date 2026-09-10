import { Fragment } from 'react';
import { IconClickerMode, IconHistory } from '@components/icons';
import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { WeekBoxProps } from '@features/reports/meeting_attendance/monthly_record/week_box/index.types';
import useWeekBox from '@features/reports/meeting_attendance/monthly_record/week_box/useWeekBox';
import Card from '@components/card';
import CardHeader from '@components/card_header';
import ClickerMode from '@features/reports/meeting_attendance/monthly_record/clicker_mode';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import Button from '@components/button';

const HallAttendance = (props: WeekBoxProps & { dateLabel: string }) => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();
  const navigate = useNavigate();
  const {
    values,
    fields,
    handleValueChange,
    flushField,
    recordOnline,
    noMeeting,
    canEdit,
    total,
    clickerOpen,
    clickerTitle,
    handleClickerOpen,
    handleClickerClose,
    handleClickerSave,
  } = useWeekBox(props);
  const online = Number(values.online || 0) + Number(values.onlineDeaf || 0);

  // counting is what this mode is for, so the counter is offered outright
  // rather than waiting for a field to be focused
  const clickerEnabled = !noMeeting && canEdit;

  return (
    <Card>
      <CardHeader header={t('tr_meetingAttendance')} />
      <Typography className="body-small-semibold">{props.dateLabel}</Typography>
      {noMeeting ? (
        <Typography>{t('tr_hallNoMeeting')}</Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {fields.map((field) => (
              <Fragment key={field.name}>
                {field.section && (
                  <Typography
                    className="body-small-semibold"
                    sx={{ width: '100%' }}
                  >
                    {field.section}
                  </Typography>
                )}
                <TextField
                  type="number"
                  disabled={!canEdit}
                  value={values[field.name]}
                  onChange={handleValueChange(field.name)}
                  onBlur={() => flushField(field.name)}
                  label={
                    field.name === 'present'
                      ? fields.some((f) => f.name === 'presentDeaf')
                        ? t('tr_hearing')
                        : t('tr_present')
                      : field.label
                  }
                  slotProps={{
                    htmlInput: { min: 0, step: 1, inputMode: 'numeric' },
                  }}
                  sx={{ flex: '1 1 0', minWidth: 0 }}
                />
              </Fragment>
            ))}
          </Box>
          {recordOnline && (
            <Stack spacing="4px">
              <Typography
                className="body-small-semibold"
                color="var(--accent-dark)"
              >
                {t('tr_hallMeetingSummary')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  backgroundColor: 'var(--accent-100)',
                  borderRadius: 'var(--radius-m)',
                  padding: '8px',
                  gap: '16px',
                }}
              >
                <Stack flex={1} alignItems="center">
                  <Typography color="var(--accent-dark)">{total}</Typography>
                  <Typography className="label-small-regular">
                    {t('tr_total')}
                  </Typography>
                </Stack>
                <Stack flex={1} alignItems="center">
                  <Typography color="var(--accent-dark)">
                    {total ? Math.round((online / total) * 100) : 0}%
                  </Typography>
                  <Typography className="label-small-regular">
                    {t('tr_hallOnlineRatio')}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          )}
        </>
      )}
      {/* the two ways of putting a count in belong together, so they are
          spaced as a pair rather than as two blocks of the card */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: tabletUp ? 'row' : 'column',
          gap: '8px',
        }}
      >
        {clickerEnabled && (
          <Button
            variant="main"
            startIcon={<IconClickerMode color="var(--always-white)" />}
            onClick={handleClickerOpen}
          >
            {t('tr_clickerMode')}
          </Button>
        )}

        <Button
          variant="secondary"
          startIcon={<IconHistory />}
          onClick={() => navigate('/reports/meeting-attendance')}
        >
          {t('tr_hallHistory')}
        </Button>
      </Box>

      {clickerEnabled && (
        <ClickerMode
          open={clickerOpen}
          onClose={handleClickerClose}
          title={clickerTitle}
          initialTab="present"
          recordOnline={recordOnline}
          presentValue={Number(values.present) || 0}
          onlineValue={Number(values.online) || 0}
          onSave={handleClickerSave}
        />
      )}
    </Card>
  );
};
export default HallAttendance;
