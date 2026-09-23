import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCollapseAll = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-collapse-all ${className}`}
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
          id="mask0_20440_350414"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_20440_350414)">
          <path
            d="M1 14.9998V13.3635H11V14.9998H1ZM1 10.818V9.18164H11V10.818H1Z"
            fill={color}
          />
          <path
            d="M17.6939 10.8154L13.1459 6.24793L14.1997 5.19418L17.6939 8.70768L21.1784 5.19418L22.2324 6.24793L17.6939 10.8154Z"
            fill={color}
          />
          <path
            d="M17.6939 13.1943L13.1459 17.7618L14.1997 18.8156L17.6939 15.3021L21.1784 18.8156L22.2324 17.7618L17.6939 13.1943Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCollapseAll;
