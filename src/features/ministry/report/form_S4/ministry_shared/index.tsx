import { useAppTranslation } from '@hooks/index';
import { FormS4Props } from '../index.types';
import useMinistryShared from './useMinistryShared';
import Checkbox from '@components/checkbox';
import Typography from '@components/typography';

const MinistryShared = (props: FormS4Props) => {
  const { t } = useAppTranslation();

  const { checked, handleToggleChecked, read_only, month_name } =
    useMinistryShared(props);

  return (
    <Checkbox
      label={
        <Typography>
          {t('tr_sharedMinistry')}
          {month_name && (
            <Typography component="span" color="var(--grey-350)">
              {' '}
              ({month_name})
            </Typography>
          )}
        </Typography>
      }
      disabled={read_only}
      checked={checked}
      onChange={(e) => handleToggleChecked(e.target.checked)}
    />
  );
};

export default MinistryShared;
