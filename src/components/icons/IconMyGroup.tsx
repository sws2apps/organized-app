import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconMyGroup = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-my-group ${className}`}
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
          id="mask0_11287_284531"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_11287_284531)">
          <path
            d="M9.898 13.7312L12 12.462L14.102 13.7312L13.5402 11.3332L15.3962 9.73324L12.9635 9.52749L12 7.26974L11.0365 9.52749L8.60375 9.73324L10.4598 11.3332L9.898 13.7312ZM5.5 20.2505V5.30824C5.5 4.80307 5.675 4.37549 6.025 4.02549C6.375 3.67549 6.80258 3.50049 7.30775 3.50049H16.6923C17.1974 3.50049 17.625 3.67549 17.975 4.02549C18.325 4.37549 18.5 4.80307 18.5 5.30824V20.2505L12 17.462L5.5 20.2505ZM7 17.9505L12 15.8005L17 17.9505V5.30824C17 5.23124 16.9679 5.16074 16.9038 5.09674C16.8398 5.03257 16.7692 5.00049 16.6923 5.00049H7.30775C7.23075 5.00049 7.16025 5.03257 7.09625 5.09674C7.03208 5.16074 7 5.23124 7 5.30824V17.9505Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMyGroup;
