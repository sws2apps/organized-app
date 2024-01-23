import { Typography } from '@components';
import { StyledBox, StyledInput, StyledButton } from './search_bar.styled';
import IconSearch from '../icons/IconSearch';

const SearchBar = () => {
  return (
    <StyledBox>
      <StyledButton>
        <IconSearch color="var(--grey-350)" />
      </StyledButton>
      <StyledInput placeholder="Search by number, name or city" disableUnderline={true} />
    </StyledBox>
  );
};

export default SearchBar;
