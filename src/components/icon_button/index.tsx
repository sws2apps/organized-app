import { FC } from 'react';
import { IconButton as MUIIconButton, Tooltip } from '@mui/material';
import { IconButtonType } from './index.types';

/**
 * Component representing a custom icon button.
 *
 * @param {IconButtonProps} props - Props for the CustomIconButton component.
 * @returns {JSX.Element} CustomIconButton component.
 */
const IconButton: FC<IconButtonType> = (props) => {
  const { children } = props;

  return (
    <Tooltip title={props.tooltip}>
      <MUIIconButton
        color="inherit"
        edge="start"
        sx={{
          padding: '8px',
          borderRadius: 'var(--radius-l)',
          '&:hover': {
            backgroundColor: 'var(--accent-200)',
          },
          '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
            borderRadius: 'var(--radius-l)',
            backgroundColor: 'var(--accent-200)',
          },
        }}
        {...props}
      >
        {children}
      </MUIIconButton>
    </Tooltip>
  );
};

export default IconButton;
