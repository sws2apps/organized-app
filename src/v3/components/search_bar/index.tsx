import { StyledBox, StyledInput, StyledButton } from './search_bar.styled';
import { IconSearch, IconClose } from '../icons';
import { InputAdornment } from '@mui/material';
import { useState } from 'react';

const SearchBar = () => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClear = () => {
    setValue('');
  };

  return (
    <>
      <StyledBox>
        <StyledButton>
          <IconSearch color="var(--grey-350)" />
        </StyledButton>
        <StyledInput
          placeholder="Search by number, name or city"
          disableUnderline={true}
          className="body-regular"
          value={value}
          onChange={handleChange}
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
    </>
  );
};

export default SearchBar;
