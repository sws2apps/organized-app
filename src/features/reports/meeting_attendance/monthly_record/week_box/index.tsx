import { memo } from 'react';
import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { TextFieldStyles } from './index.styles';
import { WeekBoxField, WeekBoxProps } from './index.types';
import useWeekBox from './useWeekBox';
import NowIndicator from './now_indicator';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import ClickerMode from '../clicker_mode';
import ClickerSuggestion from '../clicker_mode/suggestion_button';

const WeekBox = (props: WeekBoxProps) => {
  const { t } = useAppTranslation();

  const {
    isCurrent,
    isMeetingDay,
    detailed,
    recordOnline,
    fields,
    values,
    handleValueChange,
    flushField,
    total,
    box_label,
    noMeeting,
    canEdit,
    clickerEnabled,
    clickerOpen,
    clickerTitle,
    clickerSecondaryTitle,
    clickerTab,
    clickerPresent,
    clickerOnline,
    focusedField,
    handleFieldFocus,
    handleFieldBlur,
    handleClickerOpen,
    handleClickerClose,
    handleClickerSave,
  } = useWeekBox(props);

  const suggestionOpen = (field: WeekBoxField['name']) =>
    !clickerOpen && focusedField === field;

  return (
    <Stack spacing="4px" flex={1}>
      <Stack spacing="16px">
        {detailed && (
          <Box
            sx={{
              padding: '4px 16px',
              backgroundColor:
                props.type === 'midweek'
                  ? 'var(--accent-150)'
                  : 'var(--green-secondary)',
              borderRadius: 'var(--radius-m)',
            }}
          >
            <Typography
              className="body-small-semibold"
              color={
                props.type === 'midweek'
                  ? 'var(--accent-dark)'
                  : 'var(--weekend-meeting)'
              }
            >
              {box_label}
            </Typography>
          </Box>
        )}

        {fields.map((field, index) => {
          const last = detailed && index === fields.length - 1;

          return (
            <Stack
              key={field.name}
              spacing="4px"
              height={last && isMeetingDay ? '56px' : 'unset'}
            >
              {field.section && (
                <Typography
                  className="body-small-semibold"
                  color="var(--grey-400)"
                  // padding, since the Stack spacing resets child margins
                  sx={{ paddingBottom: '4px' }}
                >
                  {field.section}
                </Typography>
              )}

              <Box
                sx={{ position: 'relative' }}
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
                  label={field.label}
                  value={values[field.name]}
                  onChange={handleValueChange(field.name)}
                  onBlur={() => flushField(field.name)}
                  onFocus={() => handleFieldFocus(field.name)}
                  disabled={noMeeting || !canEdit}
                  slotProps={{
                    htmlInput: { className: 'h4' },
                  }}
                  sx={TextFieldStyles}
                />

                {clickerEnabled && (
                  <ClickerSuggestion
                    open={suggestionOpen(field.name)}
                    onOpen={handleClickerOpen}
                    label={t('tr_clickerMode')}
                  />
                )}
              </Box>

              {last && isCurrent && <NowIndicator type={props.type} />}
            </Stack>
          );
        })}

        {detailed && (
          <Box
            sx={{
              padding: '4px 16px',
              backgroundColor:
                props.type === 'midweek'
                  ? 'var(--accent-100)'
                  : 'rgba(var(--green-secondary-base), 0.5)',
              borderRadius: 'var(--radius-m)',
            }}
          >
            <Typography
              className="h4"
              textAlign="center"
              color={
                props.type === 'midweek'
                  ? 'var(--accent-dark)'
                  : 'var(--weekend-meeting)'
              }
            >
              {total}
            </Typography>
          </Box>
        )}
      </Stack>

      {!detailed && isCurrent && <NowIndicator type={props.type} />}

      {clickerEnabled && (
        <ClickerMode
          open={clickerOpen}
          onClose={handleClickerClose}
          title={clickerTitle}
          secondaryTitle={clickerSecondaryTitle}
          initialTab={clickerTab}
          recordOnline={recordOnline}
          presentValue={clickerPresent}
          onlineValue={clickerOnline}
          onSave={handleClickerSave}
        />
      )}
    </Stack>
  );
};

export default memo(WeekBox);
