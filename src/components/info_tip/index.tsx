import React from 'react';
import { Box } from '@mui/material';
import Typography from '@components/typography';
import { InfoTipProps } from './types';

const InfoTip: React.FC<InfoTipProps> = ({
  isBig,
  text,
  title,
  icon,
  color,
  sx,
  children,
}) => {
  const getColorStyle = () => {
    const result = {
      border: '',
      background: '',
      text: '',
      title: '',
    };

    if (color === 'white') {
      result.border = '1px solid var(--accent-300)';
      result.background = 'var(--white)';
      result.text = 'var(--grey-400)';
      result.title = isBig ? 'var(--black)' : '';
    } else if (color === 'blue') {
      result.border = '1px dashed var(--accent-300)';
      result.background = 'var(--accent-150)';
      result.text = 'var(--accent-400)';
      result.title = isBig ? 'var(--accent-400)' : '';
    }

    return result;
  };

  const style = getColorStyle();

  return (
    <Box
      sx={{
        padding: '16px',
        borderRadius: 'var(--radius-xl)',
        border: style.border,
        bgcolor: style.background,
        ...sx,
      }}
    >
      {isBig && (
        <Typography
          className="h2"
          sx={{
            color: style.title,
            marginBottom: '12px',
          }}
        >
          {title}
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          '& svg': {
            '& g, & path': {
              fill: style.text,
            },
          },
        }}
      >
        {icon}

        <Typography className="body-regular" sx={{ color: style.text }}>
          {text || children}
        </Typography>
      </Box>
    </Box>
  );
};

export default InfoTip;
