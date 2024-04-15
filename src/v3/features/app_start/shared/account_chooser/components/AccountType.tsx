import { ReactElement } from 'react';
import { Button } from '@mui/material';
import Typography from '@components/typography';
import { IconArrowBack } from '@icons/index';

const AccountType = ({
  startIcon,
  text,
  onClick,
}: {
  startIcon: ReactElement;
  text: string;
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
      <Typography className="body-regular" color="var(--accent-400)" sx={{ flex: '1 0 0' }}>
        {text}
      </Typography>
      <IconArrowBack width={24} height={24} color="var(--accent-400)" sx={{ rotate: '180deg' }} />
    </Button>
  );
};

export default AccountType;
