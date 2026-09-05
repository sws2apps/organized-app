import { memo } from 'react';
import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { TextFieldStyles } from './index.styles';
import { ClickerTab } from '../clicker_mode/index.types';
import { WeekBoxProps } from './index.types';
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

  const suggestionOpen = (field: ClickerTab) =>
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

          // the counter writes a whole count, so it is offered on the two
          // fields it knows and not on the deaf halves
          const counted = field.name === 'present' || field.name === 'online';

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
                  onFocus={
                    counted
                      ? () => handleFieldFocus(field.name as ClickerTab)
                      : undefined
                  }
                  disabled={noMeeting}
                  slotProps={{
                    htmlInput: { className: 'h4' },
                  }}
                  sx={TextFieldStyles}
                />

                {clickerEnabled && counted && (
                  <ClickerSuggestion
                    open={suggestionOpen(field.name as ClickerTab)}
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
          initialTab={focusedField ?? 'present'}
          recordOnline={recordOnline}
          presentValue={Number(values.present) || 0}
          onlineValue={Number(values.online) || 0}
          onSave={handleClickerSave}
        />
      )}
    </Stack>
  );
};

export default memo(WeekBox);
