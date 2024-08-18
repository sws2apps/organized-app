import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconE911Emergency = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-e911_emergency ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_5060_176866"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5060_176866)">
          <path
            d="M5.34618 19.5005V18.0005H6.87888L8.80577 11.5409C8.91989 11.1461 9.13848 10.8323 9.46155 10.5996C9.78462 10.3669 10.1436 10.2505 10.5385 10.2505H13.4615C13.8564 10.2505 14.2154 10.3669 14.5385 10.5996C14.8615 10.8323 15.0801 11.1461 15.1942 11.5409L17.1211 18.0005H18.6538V19.5005H5.34618ZM8.4596 18.0005H15.5404L13.75 11.9717C13.7308 11.9012 13.6939 11.8467 13.6394 11.8082C13.5849 11.7697 13.5224 11.7505 13.4519 11.7505H10.5481C10.4776 11.7505 10.4151 11.7697 10.3606 11.8082C10.3061 11.8467 10.2692 11.9012 10.25 11.9717L8.4596 18.0005ZM11.25 7.94282V3.44287H12.75V7.94282H11.25ZM16.95 10.312L15.8808 9.24285L19.075 6.07365L20.1192 7.11785L16.95 10.312ZM18.25 14.9428V13.4429H22.75V14.9428H18.25ZM7.05 10.312L3.8808 7.11785L4.925 6.07365L8.1192 9.24285L7.05 10.312ZM1.25 14.9428V13.4429H5.75V14.9428H1.25Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconE911Emergency;
