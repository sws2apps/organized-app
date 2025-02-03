import { FC, PropsWithChildren } from 'react';
import { styled } from '@mui/system';
import { Box, Stack, StackProps, SxProps } from '@mui/material';
import Markup from '@components/text_markup';
import Typography from '@components/typography';
import Divider from '@components/divider';

export const CardSection = styled(Box)({
  backgroundColor: 'var(--white)',
  padding: '15px',
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-l)',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
}) as unknown as typeof Box;

export const TwoColumnsRow = styled(Box)({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  '> *': {
    flex: '1 0 0',
  },
}) as unknown as typeof Box;

export const CardSectionTitle = ({ children }: PropsWithChildren) => {
  return <Typography className="h2">{children}</Typography>;
};

export const CardSubSectionTitle = ({ children }: PropsWithChildren) => {
  return <Typography className="h3">{children}</Typography>;
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
    <Stack spacing="8px" sx={sx}>
      <CardSectionTitle>{title}</CardSectionTitle>
      <CardSectionDescription content={description} />
    </Stack>
  );
};

export const CardSubSectionHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <Stack spacing="4px">
      <CardSubSectionTitle>{title}</CardSubSectionTitle>
      <CardSectionDescription content={description} />
    </Stack>
  );
};

export const CardSectionContent: FC<StackProps & PropsWithChildren> = ({
  children,
  ...props
}) => {
  return (
    <Stack
      spacing="16px"
      divider={<Divider color="var(--accent-200)" />}
      {...props}
    >
      {children}
    </Stack>
  );
};
