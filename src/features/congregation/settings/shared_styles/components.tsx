import { PropsWithChildren } from 'react';
import { Box, Divider, SxProps } from '@mui/material';
import Markup from '@components/text_markup';

export const CardSection = ({ children }: PropsWithChildren) => {
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

export const CardSectionContent = ({
  children,
  sx,
}: PropsWithChildren & {
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

export const CardSectionTitle = ({ children }: PropsWithChildren) => {
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

export const CardSectionDescription = ({ content }: { content: string }) => {
  return (
    <Markup
      anchorStyle={{
        fontSize: 'inherit',
      }}
      color="var(--grey-400)"
      className="body-regular"
      content={content}
    />
  );
};

export const CardSectionHeader = ({
  title,
  description,
  sx,
}: {
  title: string;
  description?: string;
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

export const TwoColumnsRow = ({
  children,
  sx,
}: PropsWithChildren & {
  sx?: SxProps;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        '> *': {
          flex: '1 0 0',
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
