import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconSchool = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-school" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2799_54675"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2799_54675)">
          <path
            d="M12 19.8461L5.50007 16.3154V10.8923L2.03857 9.00005L12 3.57703L21.9615 9.00005V16.1923H20.4616V9.8308L18.5 10.8923V16.3154L12 19.8461ZM12 12.7001L18.8404 9.00005L12 5.30005L5.15967 9.00005L12 12.7001ZM12 18.1385L17.0001 15.4385V11.6923L12 14.4213L7.00005 11.6923V15.4385L12 18.1385Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSchool;
