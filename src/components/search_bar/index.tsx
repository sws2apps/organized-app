import React, { useEffect, useState } from 'react';
import { StyledBox, StyledInput, StyledButton } from './search_bar.styled';
import { IconSearch, IconClose } from '../icons';
import { InputAdornment } from '@mui/material';
import { SearchBarProps } from './search_bar.types';

/**
 * Component for rendering a search bar input field.
 *
 * @param placeholder The placeholder text to display in the search input field.
 * @param onSearch Callback function invoked when the search button is clicked or the Enter key is pressed.
 * @param value The current value of the search input field.
 */
const SearchBar = ({ placeholder, onSearch, value }: SearchBarProps) => {
  const [valueTmp, setValueTmp] = useState(value || '');

  const handleChange = (event) => {
    const query = event.target.value;
    setValueTmp(query);
    handleSearch(query);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(value);
      event.target.blur();
    }
  };

  const handelSearchClick = (event) => {
    handleSearch(value);
    event.target.blur();
  };

  const handleSearch = (query) => {
    const searchQuery = query.trim();

    if (onSearch) {
      if (searchQuery.length > 0) {
        onSearch(searchQuery);
      } else {
        onSearch('');
      }
    }
  };

  const handleClear = () => {
    setValueTmp('');
    onSearch?.('');
  };

  useEffect(() => {
    setValueTmp(value || '');
  }, [value]);

  return (
    <StyledBox>
      <StyledButton onClick={handelSearchClick}>
        <IconSearch color="var(--grey-350)" />
      </StyledButton>
      <StyledInput
        placeholder={placeholder}
        disableUnderline={true}
        className="body-regular"
        value={valueTmp}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        endAdornment={
          value && (
            <InputAdornment position="end">
              <StyledButton onClick={handleClear}>
                <IconClose width={20} height={20} color="var(--grey-350)" />
              </StyledButton>
            </InputAdornment>
          )
        }
      />
    </StyledBox>
  );
};

export default SearchBar;
