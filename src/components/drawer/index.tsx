import { FC, ReactNode } from 'react';
import {
  Drawer as MUIDrawer,
  DrawerProps,
  Stack,
  Toolbar,
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
      slotProps={{
        paper: {
          sx: {
            backgroundColor: 'unset',
            boxShadow: 'unset',
            overflowY: 'unset',
            width: laptopUp ? 'unset' : '100%',
          },
        },
      }}
    >
      {/* matches the navbar height, so the gap below it is only the margin */}
      <Toolbar sx={{ padding: 0, minHeight: '62px !important' }} />
      <Stack
        className="pop-up-shadow"
        sx={{
          backgroundColor: 'var(--accent-100)',
          // fills what the navbar leaves, instead of 100% plus the margins
          flex: 1,
          minHeight: 0,
          width: laptopUp ? '600px' : '100%',
          margin: laptopUp ? '16px' : 'unset',
          borderRadius: laptopUp ? 'var(--radius-xxl)' : 'unset',
          padding: '12px',
          overflow: 'hidden',
          '&::-webkit-scrollbar': { width: '8px' },
        }}
        role="presentation"
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={'12px'}
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
      </Stack>
    </MUIDrawer>
  );
};

export default Drawer;
