import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { WeekBoxProps } from './index.types';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import useWeekBox from './useWeekBox';

const WeekBox = (props: WeekBoxProps) => {
  const { t } = useAppTranslation();

  const { isCurrent, handleValueChange, handleValueSave, value } =
    useWeekBox(props);

  return (
    <Stack spacing="4px" flex={1}>
      <TextField
        type="number"
        label={t('tr_weekNumber', { weekNumber: props.index })}
        value={value}
        onChange={(e) => handleValueChange(e.target.value)}
        onKeyUp={handleValueSave}
        inputProps={{ className: 'h4' }}
        sx={{
          '.MuiInputBase-input': { textAlign: 'center' },
          '& input': {
            MozAppearance: 'textfield',
          },
          '& input::-webkit-outer-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
          '& input::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
        }}
      />

      {isCurrent && (
        <Typography
          className="label-small-medium"
          textAlign="center"
          color={
            props.type === 'midweek'
              ? 'var(--midweek-meeting)'
              : 'var(--weekend-meeting)'
          }
        >
          • {t('tr_today')}
        </Typography>
      )}
    </Stack>
  );
};

export default WeekBox;
