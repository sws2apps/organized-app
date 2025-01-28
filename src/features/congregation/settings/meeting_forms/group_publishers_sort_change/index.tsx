import MenuItem from '@components/menuitem';
import Select from '@components/select';
import { GroupPublishersSortMethodOption } from '@definition/settings';
import useAppTranslation from '@hooks/useAppTranslation';
import useGroupPublishersSortMethodChange from './useGroupPublishersSortMethodChange';

const GroupPublishersSortMethodChange = () => {
  const { t } = useAppTranslation();

  const { fsgSortMethod, handleFsgSortMethodChange, isAdmin } =
    useGroupPublishersSortMethodChange();

  return (
    <Select
      label={t('tr_publisherSorting')}
      value={fsgSortMethod}
      onChange={handleFsgSortMethodChange}
      readOnly={!isAdmin}
    >
      <MenuItem value={GroupPublishersSortMethodOption.MANUAL}>
        {t('tr_manual')}
      </MenuItem>
      <MenuItem value={GroupPublishersSortMethodOption.ALPHABETICAL}>
        {t('tr_alphabetical')}
      </MenuItem>
    </Select>
  );
};

export default GroupPublishersSortMethodChange;
