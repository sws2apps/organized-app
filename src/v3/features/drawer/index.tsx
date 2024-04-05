import { Stack, Toolbar, Box, Drawer } from '@mui/material';
import { IconClose } from '@icons/index';
import Typography from '@components/typography';
import { FC, PropsWithChildren, ReactNode, useEffect } from 'react';
import ButtonIcon from '@components/icon_button';
import { useRecoilState } from 'recoil';
import { drawerState } from '@states/drawer';

type Anchor = 'left' | 'right';

interface CustomDrawerProps {
  anchor: Anchor;
  isOpen: boolean;
  onChange: () => void;
  title: string;
  headActions?: ReactNode;
  id: string;
}

const CustomDrawer: FC<PropsWithChildren & CustomDrawerProps> = ({
  title,
  children,
  anchor,
  isOpen,
  onChange,
  headActions,
  id,
}) => {
  const [openDrawer, setOpenDrawer] = useRecoilState(drawerState);

  useEffect(() => {
    if (isOpen) setOpenDrawer(id);
  }, [id, isOpen, setOpenDrawer]);

  const toggleDrawer = (newOpen: boolean) => () => {
    onChange();
    if (newOpen) setOpenDrawer(id);
    else setOpenDrawer('');
  };

  return (
    <Drawer
      id={id}
      anchor={anchor}
      open={openDrawer === id}
      onClose={toggleDrawer(false)}
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
            <ButtonIcon onClick={toggleDrawer(false)}>
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
