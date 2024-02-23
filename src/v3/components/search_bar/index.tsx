import React, { useState } from 'react';
import { StyledBox, StyledInput, StyledButton } from './search_bar.styled';
import { IconSearch, IconClose } from '../icons';
import { InputAdornment } from '@mui/material';
import { SearchBarProps } from './search_bar.types';

const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    const query = event.target.value;
    setValue(query);
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

    if (searchQuery.length > 0) {
      onSearch(searchQuery);
    } else {
      onSearch('');
    }
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <StyledBox>
      <StyledButton onClick={handelSearchClick}>
        <IconSearch color="var(--grey-350)" />
      </StyledButton>
      <StyledInput
        placeholder={placeholder}
        disableUnderline={true}
        className="body-regular"
        value={value}
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
