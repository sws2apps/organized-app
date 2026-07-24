import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { TextFieldStyles } from './index.styles';
import { WeekBoxProps } from './index.types';
import useWeekBox from './useWeekBox';
import NowIndicator from './now_indicator';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import { memo } from 'react';
import ClickerMode from '../clicker_mode';
import ClickerSuggestion from '../clicker_mode/suggestion_button';

const WeekBox = (props: WeekBoxProps) => {
  const { t } = useAppTranslation();

  const {
    isCurrent,
    recordOnline,
    handlePresentChange,
    present,
    online,
    handleOnlineChange,
    total,
    isMidweek,
    isWeekend,
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

  const suggestionOpen = (field: 'present' | 'online') =>
    !clickerOpen && focusedField === field;

  return (
    <Stack spacing="4px" flex={1}>
      <Stack spacing="16px">
        {recordOnline && (
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
              color={`var(--${props.type}-meeting)`}
            >
              {box_label}
            </Typography>
          </Box>
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
            label={recordOnline ? t('tr_present') : box_label}
            value={present}
            onChange={handlePresentChange}
            onFocus={() => handleFieldFocus('present')}
            disabled={noMeeting}
            slotProps={{
              htmlInput: { className: 'h4' },
            }}
            sx={TextFieldStyles}
          />
          {clickerEnabled && (
            <ClickerSuggestion
              open={suggestionOpen('present')}
              onOpen={handleClickerOpen}
              label={t('tr_clickerMode')}
            />
          )}
        </Box>

        {recordOnline && (
          <Stack
            spacing="4px"
            height={
              (props.type === 'midweek' && isMidweek) ||
              (props.type === 'weekend' && isWeekend)
                ? '56px'
                : 'unset'
            }
          >
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
                label={t('tr_online')}
                value={online}
                onChange={handleOnlineChange}
                onFocus={() => handleFieldFocus('online')}
                disabled={noMeeting}
                slotProps={{
                  htmlInput: { className: 'h4' },
                }}
                sx={TextFieldStyles}
              />
              {clickerEnabled && (
                <ClickerSuggestion
                  open={suggestionOpen('online')}
                  onOpen={handleClickerOpen}
                  label={t('tr_clickerMode')}
                />
              )}
            </Box>
            {isCurrent && <NowIndicator type={props.type} />}
          </Stack>
        )}

        {recordOnline && (
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

      {!recordOnline && isCurrent && <NowIndicator type={props.type} />}

      {clickerEnabled && (
        <ClickerMode
          open={clickerOpen}
          onClose={handleClickerClose}
          title={clickerTitle}
          initialTab={focusedField ?? 'present'}
          recordOnline={recordOnline}
          presentValue={Number(present) || 0}
          onlineValue={Number(online) || 0}
          onSave={handleClickerSave}
        />
      )}
    </Stack>
  );
};

export default memo(WeekBox);
