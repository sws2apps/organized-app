import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconVisitingSpeaker = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-visiting-speaker ${className}`}
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
          id="mask0_2515_25885"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2515_25885)">
          <path
            d="M4.44238 21.7506V16.2506H6.94233V21.7505L4.44238 21.7506ZM9.40391 21.7506V9.47552C8.46801 9.75885 7.80935 10.2685 7.42793 11.0044C7.0465 11.7403 6.82694 12.5916 6.76926 13.5582H5.26928C5.32698 11.5788 5.95358 10.0262 7.14908 8.90057C8.3446 7.77494 9.96158 7.21212 12 7.21212C13.7052 7.21212 14.9968 6.86373 15.875 6.16695C16.7533 5.47016 17.2116 4.2801 17.2501 2.59677H18.75C18.7308 4.03779 18.3878 5.26375 17.7212 6.27465C17.0545 7.28553 16.0128 7.96212 14.5962 8.30442V21.7505H13.0962V15.8082H10.9039V21.7505L9.40391 21.7506ZM12 5.88515C11.4885 5.88515 11.0529 5.70534 10.6933 5.34572C10.3337 4.98612 10.1539 4.55055 10.1539 4.03902C10.1539 3.52747 10.3337 3.0919 10.6933 2.7323C11.0529 2.37268 11.4885 2.19287 12 2.19287C12.5116 2.19287 12.9471 2.37268 13.3068 2.7323C13.6664 3.0919 13.8462 3.52747 13.8462 4.03902C13.8462 4.55055 13.6664 4.98612 13.3068 5.34572C12.9471 5.70534 12.5116 5.88515 12 5.88515Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconVisitingSpeaker;
