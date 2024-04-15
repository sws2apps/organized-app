import SearchBar from '@components/search_bar';
import { useAppTranslation } from '@hooks/index';
import useSearch from './useSearch';

const PersonsSearch = () => {
  const { t } = useAppTranslation();

  const { handleSearch, txtSearch } = useSearch();

  return <SearchBar placeholder={t('tr_searchByName')} value={txtSearch} onSearch={handleSearch} />;
};

export default PersonsSearch;
