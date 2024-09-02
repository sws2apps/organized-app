import usePersonFilter from './usePersonFilter';
import FilterItem from './filter_item';
import Select from '@components/select';

const PersonFilter = () => {
  const { filters, filter, handleChangeFilter } = usePersonFilter();

  return (
    <Select value={filter} onChange={(e) => handleChangeFilter(e.target.value)}>
      {filters.map((option) => (
        <FilterItem key={option.key} filter={option} />
      ))}
    </Select>
  );
};

export default PersonFilter;
