import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconAddMonth = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-add-month ${className}`}
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
          id="mask0_3859_136800"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3859_136800)">
          <path
            d="M17.25 21.7506V18.7506H14.25V17.2506H17.25V14.2506H18.75V17.2506H21.75V18.7506H18.75V21.7506L17.25 21.7506ZM5.3077 19.5006C4.80257 19.5006 4.375 19.3256 4.025 18.9756C3.675 18.6256 3.5 18.198 3.5 17.6929V6.30833C3.5 5.8032 3.675 5.37563 4.025 5.02563C4.375 4.67563 4.80257 4.50063 5.3077 4.50063H6.69233V2.38525H8.23075V4.50063H13.8077V2.38525H15.3076V4.50063H16.6922C17.1974 4.50063 17.625 4.67563 17.975 5.02563C18.325 5.37563 18.5 5.8032 18.5 6.30833V12.216C18.25 12.1852 18 12.1699 17.75 12.1699C17.5 12.1699 17.25 12.1852 17 12.216V10.3083H4.99997V17.6929C4.99997 17.7698 5.03202 17.8403 5.09612 17.9045C5.16024 17.9686 5.23077 18.0006 5.3077 18.0006H12.1442C12.1442 18.2506 12.1596 18.5006 12.1904 18.7506C12.2211 19.0006 12.2776 19.2506 12.3596 19.5006H5.3077ZM4.99997 8.80835H17V6.30833C17 6.2314 16.9679 6.16087 16.9038 6.09675C16.8397 6.03265 16.7692 6.0006 16.6922 6.0006H5.3077C5.23077 6.0006 5.16024 6.03265 5.09612 6.09675C5.03202 6.16087 4.99997 6.2314 4.99997 6.30833V8.80835Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAddMonth;
