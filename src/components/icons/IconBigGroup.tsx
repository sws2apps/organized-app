import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconBigGroup = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-big-group ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="11.8101"
          cy="12.1621"
          r="2.29452"
          stroke={color}
          strokeWidth="1.2958"
        />
        <circle
          cx="16.9424"
          cy="5.74222"
          r="2.29452"
          stroke={color}
          strokeWidth="1.2958"
        />
        <circle
          cx="6.94242"
          cy="5.74222"
          r="2.29452"
          stroke={color}
          strokeWidth="1.2958"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.8896 18.557C7.30091 19.0102 7.18301 19.5089 7.18301 19.7589V20.4947H16.5128V19.7589C16.5128 19.5311 15.9392 17.6439 11.7298 17.6439C9.62836 17.6439 8.48899 18.0956 7.8896 18.557ZM7.09912 17.5303C8.00502 16.8328 9.46301 16.3481 11.7298 16.3481C16.257 16.3481 17.8086 18.4738 17.8086 19.7589V21.7905H5.88721V19.7589C5.88721 19.1187 6.18252 18.2359 7.09912 17.5303Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.26734 10C5.5563 10.1278 4.33105 10.5584 3.4887 11.1165C2.49504 11.7747 2 12.6442 2 13.3718V15.4035H7.92994C7.61775 15.0137 7.36069 14.5778 7.1706 14.1077H3.2958V13.3718C3.2958 13.2093 3.44866 12.6973 4.20433 12.1967C4.75098 11.8346 5.5989 11.494 6.85979 11.3412C6.93513 10.8699 7.074 10.4198 7.26734 10Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.8198 11.3317C18.2557 11.4629 19.1986 11.8292 19.7895 12.2206C20.5452 12.7212 20.698 13.2332 20.698 13.3957V14.1315H16.6614C16.5018 14.5969 16.2778 15.0324 16 15.4273H21.9938V13.3957C21.9938 12.668 21.4988 11.7986 20.5051 11.1403C19.5986 10.5397 18.2485 10.0867 16.3266 10C16.5487 10.4135 16.7163 10.8606 16.8198 11.3317Z"
          fill={color}
        />
      </svg>
    </SvgIcon>
  );
};

export default IconBigGroup;
