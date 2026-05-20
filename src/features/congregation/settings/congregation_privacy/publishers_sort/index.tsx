import { PublishersSortOption } from '@definition/settings';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import usePublishersSort from './usePublishersSort';
import MenuItem from '@components/menuitem';
import Select from '@components/select';

const PublishersSort = () => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const { fsgSortMethod, handleFsgSortMethodChange } = usePublishersSort();

  return (
    <Select
      label={t('tr_publisherSorting')}
      value={fsgSortMethod}
      onChange={(e) =>
        handleFsgSortMethodChange(e.target.value as PublishersSortOption)
      }
      readOnly={!isServiceCommittee}
    >
      <MenuItem value={PublishersSortOption.MANUAL}>{t('tr_manual')}</MenuItem>
      <MenuItem value={PublishersSortOption.ALPHABETICAL}>
        {t('tr_alphabetical')}
      </MenuItem>
    </Select>
  );
};

export default PublishersSort;
