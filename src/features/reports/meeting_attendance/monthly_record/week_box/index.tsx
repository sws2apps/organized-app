import { memo } from 'react';
import { Box, Stack } from '@mui/material';
import { TextFieldStyles } from './index.styles';
import { WeekBoxProps } from './index.types';
import useWeekBox from './useWeekBox';
import NowIndicator from './now_indicator';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const WeekBox = (props: WeekBoxProps) => {
  const {
    isCurrent,
    isMeetingDay,
    detailed,
    fields,
    values,
    handleValueChange,
    total,
    box_label,
    noMeeting,
  } = useWeekBox(props);

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
                >
                  {field.section}
                </Typography>
              )}

              <TextField
                type="number"
                label={field.label}
                value={values[field.name]}
                onChange={handleValueChange(field.name)}
                disabled={noMeeting}
                slotProps={{
                  htmlInput: { className: 'h4' },
                }}
                sx={TextFieldStyles}
              />

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
    </Stack>
  );
};

export default memo(WeekBox);
