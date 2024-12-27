import { ReactElement } from 'react';
import { Button } from '@mui/material';
import Typography from '@components/typography';
import { IconArrowBack } from '@icons/index';
import { Box } from '@mui/material';

const AccountType = ({
  startIcon,
  text,
  subtitle,
  onClick,
}: {
  startIcon: ReactElement;
  text: string;
  subtitle?: string;
  onClick: VoidFunction;
}) => {
  return (
    <Button
      disableRipple
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textTransform: 'none',
        padding: '24px',
        gap: '16px',
        borderRadius: 'var(--radius-l)',
        border: '1px solid var(--accent-300)',
        textAlign: 'left',
        '&:hover': {
          border: '1px solid var(--accent-main)',
          background: 'var(--accent-150)',
          '& svg, & svg g, & svg g path': {
            fill: 'var(--accent-main)',
          },
          '& p': {
            color: 'var(--accent-main)',
          },
          '@media (hover: none)': {
            border: '1px solid var(--accent-300)',
            background: 'unset',
            '& svg, & svg g, & svg g path': {
              fill: 'var(--accent-400)',
            },
            '& p': {
              color: 'var(--accent-400)',
            },
          },
        },
      }}
      onClick={onClick}
    >
      {startIcon}
      <Box sx={{ flex: '1 0 0' }}>
        <Typography
          className="body-regular"
          color="var(--accent-400)"
          sx={{ marginBottom: subtitle ? '4px' : '0' }}
        >
          {text}
        </Typography>
        {subtitle && (
          <Typography className="body-small-regular" color="var(--accent-300)">
            {subtitle}
          </Typography>
        )}
      </Box>
      <IconArrowBack
        width={24}
        height={24}
        color="var(--accent-400)"
        sx={{ rotate: '180deg' }}
      />
    </Button>
  );
};

export default AccountType;
