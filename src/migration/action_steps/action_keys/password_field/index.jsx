/* eslint-disable react/prop-types */

import { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { RemoveRedEye, VisibilityOff } from '@mui/icons-material';

const PasswordField = (props) => {
  const [type, setType] = useState('password');

  const handleSwitchType = () => {
    setType((prev) => {
      if (prev === 'text') return 'password';
      if (prev === 'password') return 'text';
    });
  };

  return (
    <TextField
      {...props}
      autoComplete="off"
      size="small"
      type={type}
      variant="outlined"
      label={props.label}
      sx={{
        '.MuiInputBase-root': {
          paddingRight: '2px',
        },
        ...props.sx,
      }}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleSwitchType}>
                {type === 'password' && <RemoveRedEye />}
                {type === 'text' && <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordField;
