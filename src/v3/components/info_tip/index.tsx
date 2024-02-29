import { ReactElement } from 'react';
import { Box } from '@mui/material';
import Typography from '@components/typography';

const InfoTip = ({
  isBig,
  text,
  title,
  icon,
  color,
}: {
  isBig: boolean;
  text: string;
  title?: string;
  icon?: ReactElement;
  color?: string;
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
    <>
      <Box
        sx={{
          padding: '16px',
          borderRadius: 'var(--radius-xl)',
          border: style.border,
          bgcolor: style.background,
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
          }}
        >
          <Box
            sx={{
              '& svg': {
                '& g, & path': {
                  fill: style.text,
                },
              },
              width: '24px',
              height: '24px',
            }}
          >
            {icon}
          </Box>

          <Typography className="body-regular" sx={{ color: style.text }}>
            {text}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default InfoTip;
