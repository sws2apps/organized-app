import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { InfoBannerProps, InfoBannerVariant } from './index.types';
import Typography from '@components/typography';

const VARIANT_COLORS: Record<
  InfoBannerVariant,
  { background: string; foreground: string }
> = {
  orange: { background: 'var(--orange-secondary)', foreground: 'var(--orange-dark)' },
  green: { background: 'var(--green-secondary)', foreground: 'var(--green-main)' },
  red: { background: 'var(--red-secondary)', foreground: 'var(--red-main)' },
};

const InfoBanner = ({
  children,
  variant = 'orange',
  icon,
  bordered = false,
  className = 'body-small-regular',
  sx,
}: InfoBannerProps) => {
  const { background, foreground } = VARIANT_COLORS[variant];

  return (
    <Box
      sx={[
        {
          borderRadius: 'var(--radius-xl)',
          padding: '16px',
          backgroundColor: background,
          border: bordered ? `1px solid ${foreground}` : 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        component="div"
        className={className}
        color={foreground}
        sx={{
          letterSpacing: '0px !important',
          // Let markup children (<p>) flow inline so text wraps under the icon.
          '& p': {
            display: 'inline',
            margin: 0,
            letterSpacing: '0px !important',
          },
        }}
      >
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            verticalAlign: 'middle',
            marginTop: '-2px',
            marginRight: '6px',
          }}
        >
          {icon ?? <IconInfo color={foreground} />}
        </Box>
        {children}
      </Typography>
    </Box>
  );
};

export default InfoBanner;
