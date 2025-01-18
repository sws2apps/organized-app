import { useAppTranslation } from '@hooks/index';
import { PartDurationType } from './index.types';
import usePartDuration from './usePartDuration';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const PartDuration = (props: PartDurationType) => {
  const { t } = useAppTranslation();

  const { options, handleChangeDuration, value } = usePartDuration(props);

  return (
    <Select
      label={t('tr_duration')}
      sx={{
        width: '120px',
        flexShrink: 0,
        '& .MuiSelect-select': {
          display: 'flex !important',
          alignItems: 'center !important',
        },

        '& .MuiInputBase-root': {
          height: '44px',
        },
      }}
      value={value}
      onChange={(e) => handleChangeDuration(+e.target.value)}
    >
      {options.map((time) => (
        <MenuItem key={time} value={time}>
          <Typography>
            {time} {t('tr_minLabel')}
          </Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default PartDuration;
