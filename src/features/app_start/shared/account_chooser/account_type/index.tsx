import { cloneElement, ReactElement, useState } from 'react';
import { Box, Button } from '@mui/material';
import { IconArrowBack } from '@icons/index';
import Typography from '@components/typography';

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
      onFocus={() => setButtonIsHovered(true)}
      onBlur={() => setButtonIsHovered(false)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        textTransform: 'none',
        padding: '24px',
        gap: '8px',
        '&:focus-visible': {
          outline: 'var(--accent-main) auto 1px',
        },
        borderRadius: 'var(--radius-l)',
        border: '1px solid var(--accent-300)',
        textAlign: 'left',
        transition: 'border 0.15s ease-in-out, background 0.15s ease-in-out, box-shadow 0.15s ease-in-out, color 0.15s ease-in-out',
        '&:hover': {
          border: '1px solid var(--accent-main)',
          background: 'var(--accent-150)',
          boxShadow: 'var(--message-glow)',
          '& p': {
            color: 'var(--accent-main)',
          },
          '@media (hover: none)': {
            border: '1px solid var(--accent-300)',
            background: 'unset',
            boxShadow: 'none',
            '& p': {
              color: 'var(--accent-400)',
            },
          },
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
        }}
      >
        {startIcon &&
          cloneElement(startIcon, {
            color: buttonIsHovered ? 'var(--accent-main)' : 'var(--accent-400)',
          })}
        <Typography
          className="h4"
          color="var(--accent-400)"
          sx={{ flex: 1 }}
        >
          {text}
        </Typography>
        <IconArrowBack
          width={20}
          height={20}
          color={buttonIsHovered ? 'var(--accent-main)' : 'var(--accent-400)'}
          sx={{
            rotate: '180deg',
            opacity: buttonIsHovered ? 1 : 0,
            transform: buttonIsHovered ? 'translateX(0)' : 'translateX(8px)',
            transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
          }}
        />
      </Box>

      {subtitle && (
        <Typography
          className="body-small-regular"
          color="var(--accent-350)"
          sx={{ width: '100%' }}
        >
          {subtitle}
        </Typography>
      )}
    </Button>
  );
};

export default AccountType;
