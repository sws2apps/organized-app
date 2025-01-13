import { FC, ReactNode } from 'react';
import {
  Stack,
  Toolbar,
  Box,
  Drawer as MUIDrawer,
  DrawerProps,
} from '@mui/material';
import { IconClose } from '@icons/index';
import { useBreakpoints } from '@hooks/index';
import Typography from '@components/typography';
import ButtonIcon from '@components/icon_button';

/**
 * Props for the CustomDrawer component.
 */
interface CustomDrawerProps {
  /**
   * The title of the drawer.
   */
  title: string;

  /**
   * Additional actions to be displayed in the header.
   */
  headActions?: ReactNode;

  /**
   * Function to handle the close event of the drawer.
   */
  onClose: () => void;
}

/**
 * Custom drawer component.
 *
 * @param {CustomDrawerProps & DrawerProps} props - Props for the CustomDrawer component.
 * @returns {JSX.Element} Custom drawer component.
 */
const Drawer: FC<DrawerProps & CustomDrawerProps> = ({
  title,
  headActions,
  onClose,
  children,
  ...props
}) => {
  const { laptopUp } = useBreakpoints();

  const handleClose = () => {
    onClose();
  };

  return (
    <MUIDrawer
      {...props}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: 'unset',
          boxShadow: 'unset',
          overflowY: 'unset',
          width: laptopUp ? 'unset' : '100%',
        },
      }}
    >
      <Toolbar sx={{ padding: 0 }} />
      <Box
        className="pop-up-shadow"
        sx={{
          backgroundColor: 'var(--accent-100)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          width: laptopUp ? '600px' : '100%',
          margin: laptopUp ? '10px' : 'unset',
          borderRadius: laptopUp ? 'var(--radius-xxl)' : 'unset',
          padding: '12px',
          overflow: 'hidden',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
        }}
        role="presentation"
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={'24px'}
          ml={'12px'}
        >
          <Typography className="h1">{title}</Typography>
          <Stack direction={'row'} spacing={0.5}>
            {headActions}
            <ButtonIcon onClick={handleClose}>
              <IconClose color="var(--black)" />
            </ButtonIcon>
          </Stack>
        </Stack>

        {children}
      </Box>
    </MUIDrawer>
  );
};

export default Drawer;
