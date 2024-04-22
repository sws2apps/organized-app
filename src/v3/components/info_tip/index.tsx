import { ReactElement } from 'react';
import { Box, SxProps } from '@mui/material';
import Typography from '@components/typography';

/**
 * Component representing an information tip.
 *
 * @param {boolean} isBig - Indicates whether the information tip is big or not.
 * @param {string} text - The text content of the information tip.
 * @param {string} [title] - The title of the information tip.
 * @param {ReactElement} [icon] - The icon element to display alongside the text.
 * @param {string} [color] - The color of the information tip.
 * @param {SxProps} [sx] - Additional styles for the information tip container.
 * @returns {JSX.Element} InfoTip component.
 */
const InfoTip = ({
  isBig,
  text,
  title,
  icon,
  color,
  sx,
}: {
  isBig: boolean;
  text: string;
  title?: string;
  icon?: ReactElement;
  color?: string;
  sx?: SxProps;
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
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

export default InfoTip;
