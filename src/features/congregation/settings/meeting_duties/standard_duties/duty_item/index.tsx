import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { DUTIES_MAX } from '../../shared/constants';
import { TwoColumnsRow } from '@features/congregation/settings/shared_styles';
import { DutyItemProps } from './index.types';
import useDutyItem from './useDutyItem';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const DutyItem = (props: DutyItemProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { value, handleAmountChange } = useDutyItem(props);

  // audio/video: 1 = combined A/V person, 2 = audio + video
  const amounts =
    props.duty === 'tr_audioVideo'
      ? DUTIES_MAX.filter((num) => num <= 2)
      : DUTIES_MAX;

  return (
    <TwoColumnsRow
      sx={{
        flexDirection: laptopUp ? 'row' : 'column',
        alignItems: laptopUp ? 'center' : 'unset',
      }}
    >
      <Typography>{t(props.duty)}</Typography>

      <Select
        label={t('tr_amountLabel')}
        value={value}
        onChange={handleAmountChange}
      >
        <MenuItem value={0}>
          <Typography>{t('tr_disabledLabel')}</Typography>
        </MenuItem>

        {amounts.map((num) => (
          <MenuItem key={num} value={num}>
            <Typography>{num}</Typography>
          </MenuItem>
        ))}
      </Select>
    </TwoColumnsRow>
  );
};

export default DutyItem;
