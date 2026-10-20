import MajorEvents from '@features/activities/hall_cleaning/major_events';
import { CLEANING_FIELD_MIN_WIDTH } from '@features/activities/hall_cleaning/shared';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Stack } from '@mui/material';
import { dutyFieldColumns } from '@features/meetings/duties_schedule/shared';
import {
  IconClean,
  IconDelete,
  IconDiamond,
  IconInfo,
  IconSync,
  IconVacuum,
  IconWatchtowerStudy,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useCleaningEditor from '@features/activities/hall_cleaning/cleaning_editor/useCleaningEditor';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import Divider from '@components/divider';
import DutyRow from '@features/meetings/duties_schedule/duty_row';
import Autocomplete from '@components/autocomplete';
import DateNavigator from '@components/date_navigator';
import IconButton from '@components/icon_button';
import InfoNote from '@components/info_note';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import Tooltip from '@components/tooltip';

const slotIcon = (slot: string, weekly: boolean) => {
  if (slot === 'yearly') return <IconVacuum color="var(--accent-dark)" />;
  if (weekly) return <IconClean color="var(--accent-dark)" />;
  if (slot === 'weekend')
    return <IconWatchtowerStudy color="var(--accent-dark)" />;
  return <IconDiamond color="var(--accent-dark)" />;
};

const CleaningEditor = () => {
  const { t } = useAppTranslation();

  const { tablet500Down, laptopDown } = useBreakpoints();

  const navigate = useNavigate();

  const [removeOpen, setRemoveOpen] = useState(false);

  const {
    dataView,
    selectedWeek,
    weekDateLocale,
    isCurrentWeek,
    weekNav,
    weekDays,
    rows,
    period,
    hasQualified,
    hasGroups,
    yearlyDate,
    handleChangeWeekBack,
    handleChangeWeekNext,
    handleGroupChange,
    handleResetGroup,
    handleYearlyDateChange,
    handleRemoveYearly,
  } = useCleaningEditor();

  return (
    <Box
      sx={{
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        marginBottom: laptopDown ? '96px' : 0,
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        flexGrow: 1,
        minWidth: 0,
      }}
    >
      {removeOpen && (
        <Dialog
          open={removeOpen}
          onClose={() => setRemoveOpen(false)}
          sx={{ padding: '24px' }}
        >
          <Stack spacing="24px" sx={{ width: '100%' }}>
            <Stack spacing="8px">
              <Typography className="h2">{t('tr_delete')}</Typography>
              <Typography color="var(--grey-400)">
                {t('tr_hallCleaningDeleteYearlyDesc')}
              </Typography>
            </Stack>

            <Stack spacing="8px">
              <Button
                variant="main"
                color="red"
                onClick={async () => {
                  setRemoveOpen(false);
                  await handleRemoveYearly();
                }}
              >
                {t('tr_delete')}
              </Button>
              <Button variant="secondary" onClick={() => setRemoveOpen(false)}>
                {t('tr_cancel')}
              </Button>
            </Stack>
          </Stack>
        </Dialog>
      )}

      {weekDateLocale.length === 0 && (
        <InfoNote message={t('tr_infoPlanHallCleaning')} />
      )}

      {weekDateLocale.length > 0 && (
        <Stack spacing="16px">
          <DateNavigator
            value={weekDateLocale}
            onBack={handleChangeWeekBack}
            onNext={handleChangeWeekNext}
            disableBack={!weekNav.back}
            disableNext={!weekNav.next}
            labelMinWidth={tablet500Down ? undefined : '140px'}
            badgeText={t('tr_today')}
            badgeVisible={isCurrentWeek}
            sx={{
              width: tablet500Down ? '100%' : 'auto',
              alignSelf: 'flex-start',
            }}
          />

          {!hasQualified && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconInfo color="var(--accent-400)" />
              <TextMarkup
                content={t('tr_hallCleaningNoQualified')}
                className="body-regular"
                color="var(--grey-400)"
                anchorClassName="body-regular"
                anchorClick={(e) => {
                  e.preventDefault();
                  navigate('/persons');
                }}
              />
            </Box>
          )}

          <Typography className="h4">{t('tr_regularCleaning')}</Typography>
          <Stack spacing="16px" divider={<Divider color="var(--accent-200)" />}>
            {rows.map((row) => (
              <DutyRow
                key={row.slot}
                duty={row.label}
                icon={slotIcon(row.slot, period === 'week')}
                minFieldWidth={CLEANING_FIELD_MIN_WIDTH}
                week={selectedWeek}
                fields={row.fields}
                allowedPersons={row.allowedPersons}
              >
                {row.slot === 'yearly' && (
                  <Stack direction="row" spacing="8px">
                    <DatePicker
                      label={t('tr_date')}
                      value={yearlyDate ? new Date(yearlyDate) : null}
                      minDate={weekDays.start}
                      maxDate={weekDays.end}
                      onChange={handleYearlyDateChange}
                    />

                    <IconButton
                      aria-label={t('tr_hallCleaningDeleteYearly')}
                      onClick={() => setRemoveOpen(true)}
                    >
                      <IconDelete color="var(--red-main)" />
                    </IconButton>
                  </Stack>
                )}

                {row.showGroup && (
                  <Box sx={{ containerType: 'inline-size', width: '100%' }}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr)',
                        columnGap: '8px',
                        rowGap: '16px',
                        [`@container (min-width: ${CLEANING_FIELD_MIN_WIDTH * 2 + 8}px)`]:
                          {
                            gridTemplateColumns: `repeat(${Math.min(2, row.groupFields.length)}, minmax(0, 1fr))`,
                          },
                        [`@container (min-width: ${CLEANING_FIELD_MIN_WIDTH * 3 + 16}px)`]:
                          {
                            gridTemplateColumns: `repeat(${12 / dutyFieldColumns(row.groupFields.length)}, minmax(0, 1fr))`,
                          },
                      }}
                    >
                      {row.groupFields.map((group) => (
                        <Box key={group.position} sx={{ minWidth: 0 }}>
                          <Stack spacing="8px">
                            <Stack
                              direction="row"
                              spacing="8px"
                              sx={{ alignItems: 'flex-start' }}
                            >
                              <Autocomplete
                                height={44}
                                showInputClearButton
                                label={group.label}
                                options={group.options}
                                optionsHeader={
                                  !hasGroups ? (
                                    <Button
                                      variant="small"
                                      disableAutoStretch
                                      onClick={() =>
                                        navigate('/field-service-groups')
                                      }
                                    >
                                      {t('tr_serviceGroupsQuickEdit')}
                                    </Button>
                                  ) : undefined
                                }
                                value={
                                  group.options.find(
                                    (item) => item.value === group.value
                                  ) ?? null
                                }
                                getOptionLabel={(option) =>
                                  typeof option === 'string'
                                    ? option
                                    : option.label
                                }
                                isOptionEqualToValue={(option, value) =>
                                  typeof option !== 'string' &&
                                  typeof value !== 'string' &&
                                  option.value === value.value
                                }
                                onChange={(_, value) => {
                                  if (
                                    typeof value !== 'string' &&
                                    !Array.isArray(value)
                                  )
                                    void handleGroupChange(
                                      row.slot,
                                      value?.value ?? '',
                                      group.position
                                    );
                                }}
                                sx={{ flex: 1, minWidth: 0 }}
                              />
                              {group.canReset && (
                                <Tooltip
                                  title={t('tr_hallCleaningBackToTurns')}
                                >
                                  <IconButton
                                    aria-label={t('tr_hallCleaningBackToTurns')}
                                    edge={false}
                                    onClick={() =>
                                      handleResetGroup(row.slot, group.position)
                                    }
                                    sx={{
                                      width: '44px',
                                      height: '44px',
                                      flexShrink: 0,
                                      margin: 0,
                                      borderRadius: 'var(--radius-l)',
                                      backgroundColor: 'var(--accent-150)',
                                    }}
                                  >
                                    <IconSync color="var(--accent-dark)" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                            {group.helper && (
                              <Typography
                                className="label-small-regular"
                                color="var(--grey-400)"
                              >
                                {group.helper}
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </DutyRow>
            ))}
          </Stack>

          {rows.length === 0 && <InfoNote message={t('tr_noMeeting')} />}

          <MajorEvents
            key={`${dataView}:${selectedWeek}`}
            week={selectedWeek}
          />
        </Stack>
      )}
    </Box>
  );
};

export default CleaningEditor;
