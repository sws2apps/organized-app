import { Typography } from '@components';
import { StyledBox, StyledInput } from './search_bar.styled';
import IconSearch from '../icons/IconSearch';

const SearchBar = () => {
  return (
    <StyledBox>
      <IconSearch color="var(--grey-350)" />
      <StyledInput placeholder="Search by number, name or city" />
    </StyledBox>
  );
};

export default SearchBar;
