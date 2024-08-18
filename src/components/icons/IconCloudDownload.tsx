import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCloudDownload = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-cloud_download ${className}`}
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
          id="mask0_2621_40482"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2621_40482)">
          <path
            d="M6.49998 19.5002C5.11794 19.5002 3.9391 19.0201 2.96345 18.0599C1.98782 17.0996 1.5 15.9285 1.5 14.5464C1.5 13.3233 1.89167 12.2355 2.675 11.283C3.45833 10.3304 4.45769 9.76695 5.67308 9.5926C5.89873 8.37337 6.56379 7.2333 7.66828 6.1724C8.77276 5.1115 9.96667 4.58105 11.25 4.58105C11.659 4.58105 12.0112 4.72881 12.3067 5.02433C12.6022 5.31983 12.75 5.67206 12.75 6.08103V12.7465L14.5808 10.9464L15.6346 12.0003L12 15.6349L8.36538 12.0003L9.4192 10.9464L11.25 12.7465V6.08103C9.98973 6.22461 8.96633 6.80346 8.1798 7.81756C7.39325 8.83166 6.99998 9.89256 6.99998 11.0003H6.49998C5.53331 11.0003 4.70831 11.3419 4.02498 12.0253C3.34164 12.7086 2.99998 13.5336 2.99998 14.5003C2.99998 15.4669 3.34164 16.2919 4.02498 16.9753C4.70831 17.6586 5.53331 18.0003 6.49998 18.0003H18.5C19.2 18.0003 19.7916 17.7586 20.275 17.2753C20.7583 16.7919 21 16.2003 21 15.5003C21 14.8003 20.7583 14.2086 20.275 13.7253C19.7916 13.2419 19.2 13.0003 18.5 13.0003H17V11.0003C17 10.1874 16.8166 9.4352 16.45 8.74353C16.0833 8.05186 15.6 7.47077 15 7.00025V5.2426C16.0859 5.79389 16.9407 6.58747 17.5644 7.62336C18.1881 8.65926 18.5 9.78489 18.5 11.0003V11.5003H18.8077C19.8615 11.5823 20.7403 12.006 21.4442 12.7714C22.148 13.5368 22.5 14.4464 22.5 15.5003C22.5 16.6156 22.1121 17.5611 21.3365 18.3368C20.5609 19.1124 19.6153 19.5002 18.5 19.5002H6.49998Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCloudDownload;
