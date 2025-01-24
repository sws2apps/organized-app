import MenuItem from '@components/menuitem';
import Select from '@components/select';
import { FieldServiceGroupPublishersSortOption } from '@definition/settings';
import useAppTranslation from '@hooks/useAppTranslation';
import useFieldServiceGroupsSortMethodChange from './useFieldServiceGroupsSortMethodChange';

const FieldServiceGroupsSortMethodChange = () => {
  const { t } = useAppTranslation();

  const { fsgSortMethod, handleFsgSortMethodChange } =
    useFieldServiceGroupsSortMethodChange();

  return (
    <Select
      label={t('tr_publisherSorting')}
      value={fsgSortMethod}
      onChange={handleFsgSortMethodChange}
    >
      <MenuItem value={FieldServiceGroupPublishersSortOption.MANUAL}>
        {t('tr_manual')}
      </MenuItem>
      <MenuItem value={FieldServiceGroupPublishersSortOption.ALPHABETICAL}>
        {t('tr_aphabetical')}
      </MenuItem>
    </Select>
  );
};

export default FieldServiceGroupsSortMethodChange;
