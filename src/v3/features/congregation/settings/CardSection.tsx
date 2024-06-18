import { Typography } from '@components/index';
import { Box, Divider, SxProps } from '@mui/material';

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

const CardSectionContent = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        '& + & .divider': {
          display: 'block',
        },
        '.divider': {
          display: 'none',
        },
      }}
    >
      <Divider
        className="divider"
        sx={{
          color: 'var(--accent-200)',
        }}
      />
      {children}
    </Box>
  );
};

const CardSectionTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      style={{
        fontWeight: '550',
        fontSize: '20px',
        lineHeight: '28px',
      }}
    >
      {children}
    </p>
  );
};

const CardSectionDescription = ({ children }: { children?: React.ReactNode }) => {
  return <Typography className="body-regular">{children}</Typography>;
};

const CardSectionHeader = ({ title, description, sx }: { title: string; description: string; sx?: SxProps }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        ...sx,
      }}
    >
      <CardSectionTitle>{title}</CardSectionTitle>
      <CardSectionDescription>{description}</CardSectionDescription>
    </Box>
  );
};

export { CardSection, CardSectionContent, CardSectionTitle, CardSectionDescription, CardSectionHeader };
