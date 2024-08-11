import { MenuItem as MUIMenuItem, MenuItemProps } from '@mui/material';
import { FC } from 'react';

/**
 * Custom menu item component.
 * @param props - Props for the MenuItem component.
 * @returns JSX element for the CustomMenuItem component.
 */
const MenuItem: FC<MenuItemProps> = (props) => {
  return (
    <MUIMenuItem
      disableRipple
      sx={{
        padding: '8px 12px 8px 16px',
        height: '36px',
        minHeight: '36px',
        '&:hover': {
          backgroundColor: 'var(--accent-150)',
          '& p': {
            color: 'var(--accent-dark)',
          },
        },
      }}
      {...props}
    />
  );
};

export default MenuItem;
