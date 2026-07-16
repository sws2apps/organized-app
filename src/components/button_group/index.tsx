import React from 'react';
import { Button, ButtonGroup as MuiButtonGroup } from '@mui/material';
import { ButtonGroupType } from './index.types';

const ButtonGroup = ({ buttons, fullWidth }: ButtonGroupType) => {
  return (
    <MuiButtonGroup
      fullWidth={fullWidth}
      sx={{
        minHeight: '32px',
        '& .MuiButtonGroup-lastButton': {
          marginLeft: 'unset !important',
        },
        '& .MuiButton-root': {
          border: '1px solid var(--accent-300)',
          color: 'var(--accent-400)',
          transition: 'background-color 0.8s ease',
        },
        '& .MuiButton-root.active': {
          border: '1px solid var(--accent-dark)',
          backgroundColor: 'var(--accent-200)',
          color: 'var(--accent-dark)',
        },
      }}
    >
      {buttons.map((button, index) => {
        const labelText = React.Children.toArray(button.children)
          .map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : ''))
          .join('');
        return (
          <Button
            key={`button-${index}`}
            {...button}
            className={`${button.className ?? ''} ${(button.className ?? '') === 'active' ? 'h4' : 'body-regular'}`}
            data-text={labelText}
            sx={{
              padding: '0 20px',
              display: 'inline-flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              '&::after': {
                content: 'attr(data-text)',
                fontWeight: 500,
                fontSize: '16px',
                letterSpacing: '0px',
                height: 0,
                visibility: 'hidden',
                overflow: 'hidden',
                pointerEvents: 'none',
                userSelect: 'none',
                display: 'block',
                '@media (max-width: 768px)': {
                  fontSize: '15px',
                  letterSpacing: '-0.3px',
                },
              },
            }}
          />
        );
      })}
    </MuiButtonGroup>
  );
};

export default ButtonGroup;

