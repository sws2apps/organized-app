import { FC, ReactNode } from 'react';
import { Stack, Toolbar, Box, Drawer, DrawerProps } from '@mui/material';
import { IconClose } from '@icons/index';
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
const CustomDrawer: FC<DrawerProps & CustomDrawerProps> = ({ title, headActions, onClose, children, ...props }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer
      {...props}
      onClose={handleClose}
      PaperProps={{ sx: { backgroundColor: 'unset', boxShadow: 'unset', overflowY: 'unset' } }}
    >
      <Toolbar sx={{ padding: 0 }} />
      <Box
        className="pop-up-shadow"
        sx={(theme) => ({
          backgroundColor: 'var(--accent-100)',
          height: '100%',
          paddingBottom: '0 !important',
          [theme.breakpoints.down('tablet')]: {
            width: '100vw !important',
            padding: '12px',
          },
          [theme.breakpoints.down(769)]: {
            width: '60vw',
          },
          [theme.breakpoints.up('laptop')]: {
            width: '40vw',
            margin: '10px',
            borderRadius: 'var(--radius-xxl)',
            padding: '24px',
            position: 'relative',
            overflowY: 'auto',
            overflowX: 'hidden',
          },
        })}
        role="presentation"
      >
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mb={'24px'}>
          <Typography className="h1">{title}</Typography>
          <Stack direction={'row'} spacing={0.5}>
            {headActions}
            <ButtonIcon onClick={handleClose}>
              <IconClose color="var(--black)" />
            </ButtonIcon>
          </Stack>
        </Stack>
        <Box
          sx={(theme) => ({
            paddingTop: '5px',
            [theme.breakpoints.only('mobile')]: {
              overflowY: 'auto',
              height: 'calc(100% - 120px)',
              width: '100%',
              scrollbarWidth: 'none',
              paddingBottom: '12px',
            },
            [theme.breakpoints.up('tablet')]: {
              overflowY: 'auto',
              height: 'calc(100% - 64px)',
              paddingRight: '8px',
              width: '101.5%',
              paddingBottom: '24px',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
            },
          })}
        >
          {children}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CustomDrawer;
