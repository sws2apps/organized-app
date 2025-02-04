import { PublishersSortOption } from '@definition/settings';
import { useAppTranslation } from '@hooks/index';
import usePublishersSort from './usePublishersSort';
import MenuItem from '@components/menuitem';
import Select from '@components/select';

const PublishersSort = () => {
  const { t } = useAppTranslation();

  const { fsgSortMethod, handleFsgSortMethodChange, isAdmin } =
    usePublishersSort();

  return (
    <Select
      label={t('tr_publisherSorting')}
      value={fsgSortMethod}
      onChange={(e) =>
        handleFsgSortMethodChange(e.target.value as PublishersSortOption)
      }
      readOnly={!isAdmin}
    >
      <MenuItem value={PublishersSortOption.MANUAL}>{t('tr_manual')}</MenuItem>
      <MenuItem value={PublishersSortOption.ALPHABETICAL}>
        {t('tr_alphabetical')}
      </MenuItem>
    </Select>
  );
};

export default PublishersSort;
