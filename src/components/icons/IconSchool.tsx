import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSchool = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-school ${className}`}
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
          id="mask0_2799_54675"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2799_54675)">
          <path
            d="M12 19.8467L5.50007 16.316V10.8929L2.03857 9.00066L12 3.57764L21.9615 9.00066V16.1929H20.4616V9.83141L18.5 10.8929V16.316L12 19.8467ZM12 12.7007L18.8404 9.00066L12 5.30066L5.15967 9.00066L12 12.7007ZM12 18.1391L17.0001 15.4391V11.6929L12 14.4219L7.00005 11.6929V15.4391L12 18.1391Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSchool;
