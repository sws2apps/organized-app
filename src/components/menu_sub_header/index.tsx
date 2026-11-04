import { ElementType, PropsWithChildren } from 'react';
import { ListSubheader, ListSubheaderProps } from '@mui/material';

// a group label inside a list item is a div, not a nested li
const MenuSubHeader = ({
  children,
  component,
  sx,
  ...props
}: PropsWithChildren<ListSubheaderProps & { component?: ElementType }>) => {
  return (
    <ListSubheader
      {...props}
      component={component ?? 'li'}
      className="body-small-semibold"
      sx={{
        font: 'inherit',
        padding: '16px 16px 8px 16px',
        userSelect: 'none',
        backgroundColor: 'var(--white)',
        '&.MuiListSubheader-root': {
          color: 'var(--accent-dark)',
        },
        ...sx,
      }}
    >
      {children}
    </ListSubheader>
  );
};

export default MenuSubHeader;
