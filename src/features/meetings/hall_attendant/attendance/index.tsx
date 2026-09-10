import { Fragment } from 'react';
import { IconHistory } from '@components/icons';
import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAppTranslation } from '@hooks/index';
import { ClickerTab } from '@features/reports/meeting_attendance/monthly_record/clicker_mode/index.types';
import { WeekBoxProps } from '@features/reports/meeting_attendance/monthly_record/week_box/index.types';
import useWeekBox from '@features/reports/meeting_attendance/monthly_record/week_box/useWeekBox';
import Card from '@components/card';
import CardHeader from '@components/card_header';
import ClickerMode from '@features/reports/meeting_attendance/monthly_record/clicker_mode';
import ClickerSuggestion from '@features/reports/meeting_attendance/monthly_record/clicker_mode/suggestion_button';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import Button from '@components/button';

const HallAttendance = (props: WeekBoxProps & { dateLabel: string }) => {
  const { t } = useAppTranslation();
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
    clickerEnabled,
    clickerOpen,
    clickerTitle,
    focusedField,
    handleFieldFocus,
    handleFieldBlur,
    handleClickerOpen,
    handleClickerClose,
    handleClickerSave,
  } = useWeekBox(props);
  const online = Number(values.online || 0) + Number(values.onlineDeaf || 0);

  const suggestionOpen = (field: ClickerTab) =>
    !clickerOpen && focusedField === field;

  return (
    <Card>
      <CardHeader header={t('tr_meetingAttendance')} />
      <Typography className="body-small-semibold">{props.dateLabel}</Typography>
      {noMeeting ? (
        <Typography>{t('tr_hallNoMeeting')}</Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {fields.map((field) => {
              // the counter writes a whole count, so it is offered on the two
              // fields it knows and not on the deaf halves
              const counted =
                field.name === 'present' || field.name === 'online';

              return (
                <Fragment key={field.name}>
                  {field.section && (
                    <Typography
                      className="body-small-semibold"
                      sx={{ width: '100%' }}
                    >
                      {field.section}
                    </Typography>
                  )}
                  <Box
                    sx={{ position: 'relative', flex: '1 1 0', minWidth: 0 }}
                    onBlur={(event) => {
                      if (
                        !event.currentTarget.contains(
                          event.relatedTarget as Node | null
                        )
                      ) {
                        handleFieldBlur();
                      }
                    }}
                  >
                    <TextField
                      type="number"
                      disabled={!canEdit}
                      value={values[field.name]}
                      onChange={handleValueChange(field.name)}
                      onBlur={() => flushField(field.name)}
                      onFocus={
                        counted
                          ? () => handleFieldFocus(field.name as ClickerTab)
                          : undefined
                      }
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
                      sx={{ width: '100%' }}
                    />

                    {clickerEnabled && counted && (
                      <ClickerSuggestion
                        open={suggestionOpen(field.name as ClickerTab)}
                        onOpen={handleClickerOpen}
                        label={t('tr_clickerMode')}
                      />
                    )}
                  </Box>
                </Fragment>
              );
            })}
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
      <Button
        variant="secondary"
        startIcon={<IconHistory />}
        onClick={() => navigate('/reports/meeting-attendance')}
      >
        {t('tr_hallHistory')}
      </Button>

      {clickerEnabled && (
        <ClickerMode
          open={clickerOpen}
          onClose={handleClickerClose}
          title={clickerTitle}
          initialTab={focusedField ?? 'present'}
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
