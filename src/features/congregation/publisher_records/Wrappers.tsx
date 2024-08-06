import { Box } from '@mui/material';

const CardSection = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box
      sx={{
        marginTop: '16px',
        backgroundColor: 'var(--white)',
        padding: '15px',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-l)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {children}
    </Box>
  );
};

const Wrapper = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        gap: '16px',
        '& > *': { flexBasis: 0 },
        [theme.breakpoints.down(1000)]: {
          '& > *': { flexBasis: 0, flexGrow: 1 },
        },
        [theme.breakpoints.down(800)]: {
          flexDirection: 'column',
          gap: '0',
        },
      })}
    >
      {children}
    </Box>
  );
};

const LeftColumn = ({ children }: { children?: React.ReactNode }) => {
  return <Box sx={{ flexGrow: 1 }}>{children}</Box>;
};

const RightColumn = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box
      sx={(theme) => ({
        [theme.breakpoints.down('desktop')]: {
          minWidth: '400px',
        },
        minWidth: '560px',
        [theme.breakpoints.down(1000)]: {
          minWidth: '300px',
        },
      })}
    >
      {children}
    </Box>
  );
};

export { CardSection, Wrapper, LeftColumn, RightColumn };
