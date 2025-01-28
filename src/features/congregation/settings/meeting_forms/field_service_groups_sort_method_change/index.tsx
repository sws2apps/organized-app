import MenuItem from '@components/menuitem';
import Select from '@components/select';
import { FieldServiceGroupPublishersSortOption } from '@definition/settings';
import useAppTranslation from '@hooks/useAppTranslation';
import useFieldServiceGroupsSortMethodChange from './useFieldServiceGroupsSortMethodChange';

const FieldServiceGroupsSortMethodChange = ({
  readOnly,
}: {
  readOnly: boolean;
}) => {
  const { t } = useAppTranslation();

  const { fsgSortMethod, handleFsgSortMethodChange } =
    useFieldServiceGroupsSortMethodChange();

  return (
    <Select
      label={t('tr_publisherSorting')}
      value={fsgSortMethod}
      onChange={handleFsgSortMethodChange}
      readOnly={readOnly}
    >
      <MenuItem value={FieldServiceGroupPublishersSortOption.MANUAL}>
        {t('tr_manual')}
      </MenuItem>
      <MenuItem value={FieldServiceGroupPublishersSortOption.ALPHABETICAL}>
        {t('tr_alphabetical')}
      </MenuItem>
    </Select>
  );
};

export default FieldServiceGroupsSortMethodChange;
