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
    detailed,
    recordOnline,
    fields,
    values,
    handleValueChange,
    total,
    box_label,
    noMeeting,
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
    <Stack
      spacing="4px"
      sx={{
        flex: 1,
      }}
    >
      <Stack spacing="16px">
        {detailed && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '4px',
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
              sx={{ flexShrink: 0 }}
            >
              {box_label}
            </Typography>

            {isCurrent && <NowIndicator type={props.type} />}
          </Box>
        )}

        {fields.map((field) => {
          return (
            <Stack key={field.name} spacing="4px">
              {field.section && (
                <Typography
                  className="body-small-semibold"
                  sx={{
                    color: 'var(--grey-400)',
                    paddingBottom: '4px',
                  }}
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
                  label={
                    !detailed && isCurrent
                      ? `${field.label} • ${t('tr_today')}`
                      : field.label
                  }
                  value={values[field.name]}
                  onChange={handleValueChange(field.name)}
                  onFocus={() => handleFieldFocus(field.name)}
                  disabled={noMeeting}
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
              color={
                props.type === 'midweek'
                  ? 'var(--accent-dark)'
                  : 'var(--weekend-meeting)'
              }
              sx={{
                textAlign: 'center',
              }}
            >
              {total}
            </Typography>
          </Box>
        )}
      </Stack>

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
