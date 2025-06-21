import { ReactNode } from 'react';
import { Box, List, SxProps, Theme } from '@mui/material';
import useCurrentUser from '@hooks/useCurrentUser';
import Typography from '@components/typography';

const DashboardCard = ({
  header,
  children,
  fixedHeight = true,
  color,
  sx,
}: {
  header: string | ReactNode;
  children?: ReactNode;
  fixedHeight?: boolean;
  color?: string;
  sx?: SxProps<Theme>;
}) => {
  const { isGroup } = useCurrentUser();

  return (
    <Box
      sx={{
        display: 'flex',
        height: {
          mobile: 'auto',
          tablet688: fixedHeight ? '336px' : 'fit-content',
        },
        minWidth: '300px',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 'var(--radius-xl)',
        border: color
          ? `1px solid ${color}`
          : `1px solid ${isGroup ? 'var(--red-secondary)' : 'var(--accent-200)'}`,
        background: 'var(--white)',
        padding: '8px',
        '& li': {
          borderBottom: color
            ? `1px solid ${color}`
            : `1px solid ${isGroup ? 'var(--red-secondary)' : 'var(--accent-200)'}`,
          padding: '4px 0px',
        },
        '& li:last-child': {
          borderBottom: 'none',
          padding: '4px 0px 0px 0px',
        },
        ...sx,
      }}
      className="big-card-shadow"
    >
      {typeof header === 'string' ? (
        <Box
          sx={{
            padding: '16px 0',
            alignSelf: 'stretch',
            borderRadius: 'var(--radius-m)',
            background: isGroup ? 'var(--red-secondary)' : 'var(--accent-200)',
          }}
        >
          <Typography
            className="h2"
            color={isGroup ? 'var(--red-dark)' : 'var(--accent-dark)'}
            sx={{ textAlign: 'center' }}
          >
            {header}
          </Typography>
        </Box>
      ) : (
        header
      )}
      <Box sx={{ marginTop: '8px', width: '100%', overflow: 'auto' }}>
        <List sx={{ paddingTop: 0, paddingBottom: 0 }}>{children}</List>
      </Box>
    </Box>
  );
};

export default DashboardCard;
