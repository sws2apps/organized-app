import { TextMarkup } from '@components/index';
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

const CardSectionContent = ({
  children,
  sx,
}: {
  children?: React.ReactNode;
  sx?: SxProps;
}) => {
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
        ...sx,
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
        color: 'var(--black)',
      }}
    >
      {children}
    </p>
  );
};

const CardSectionDescription = ({ content }: { content: string }) => {
  return (
    <TextMarkup
      anchorStyle={{
        fontSize: 'inherit',
      }}
      color="var(--grey-400)"
      className="body-regular"
      content={content}
    />
  );
};

const CardSectionHeader = ({
  title,
  description,
  sx,
}: {
  title: string;
  description: string;
  sx?: SxProps;
}) => {
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
      <CardSectionDescription content={description} />
    </Box>
  );
};

const TwoColumnsRow = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        '> *': {
          flex: '1 0 0',
        },
      }}
    >
      {children}
    </Box>
  );
};

export {
  CardSection,
  CardSectionContent,
  CardSectionTitle,
  CardSectionDescription,
  CardSectionHeader,
  TwoColumnsRow,
};
