import { cloneElement, ReactElement, useState } from 'react';
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
  const [buttonIsHovered, setButtonIsHovered] = useState(false);

  return (
    <Button
      disableRipple
      onMouseEnter={() => setButtonIsHovered(true)}
      onMouseLeave={() => setButtonIsHovered(false)}
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
          '& p': {
            color: 'var(--accent-main)',
          },
          '@media (hover: none)': {
            border: '1px solid var(--accent-300)',
            background: 'unset',
            '& p': {
              color: 'var(--accent-400)',
            },
          },
        },
      }}
      onClick={onClick}
    >
      {startIcon &&
        cloneElement(startIcon, {
          color: buttonIsHovered ? 'var(--accent-main)' : 'var(--accent-400)',
        })}
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
        color={buttonIsHovered ? 'var(--accent-main)' : 'var(--accent-400)'}
        sx={{ rotate: '180deg' }}
      />
    </Button>
  );
};

export default AccountType;
