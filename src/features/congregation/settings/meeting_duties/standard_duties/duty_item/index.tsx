import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { DUTIES_MAX } from '../../shared/constants';
import { Stack } from '@mui/material';
import { DutyItemProps } from './index.types';
import useDutyItem from './useDutyItem';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const DutyItem = (props: DutyItemProps) => {
  const { t } = useAppTranslation();
  const { isDutiesEditor } = useCurrentUser();

  const { value, handleAmountChange } = useDutyItem(props);

  return (
    <Stack
      sx={{
        minWidth: 0,
        justifyContent: 'space-between',
        gap: 'var(--dialog-gap-mobile)',
      }}
    >
      <Typography sx={{ overflowWrap: 'anywhere' }}>{t(props.duty)}</Typography>

      <Select
        label={t('tr_dutyPeopleNeeded')}
        inputProps={{
          'aria-label': t('tr_dutyPeopleNeededFor', { duty: t(props.duty) }),
        }}
        readOnly={!isDutiesEditor}
        value={value}
        onChange={handleAmountChange}
      >
        <MenuItem value={0}>
          <Typography>{t('tr_disabledLabel')}</Typography>
        </MenuItem>

        {DUTIES_MAX.map((num) => (
          <MenuItem key={num} value={num}>
            <Typography>{num}</Typography>
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
};

export default DutyItem;
