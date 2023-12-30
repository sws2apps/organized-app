import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconVisitingSpeaker = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-visiting-speaker" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2515_25885"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2515_25885)">
          <path
            d="M4.44238 21.75V16.25H6.94233V21.7499L4.44238 21.75ZM9.40391 21.75V9.47491C8.46801 9.75824 7.80935 10.2679 7.42793 11.0038C7.0465 11.7397 6.82694 12.5909 6.76926 13.5576H5.26928C5.32698 11.5781 5.95358 10.0256 7.14908 8.89996C8.3446 7.77433 9.96158 7.21151 12 7.21151C13.7052 7.21151 14.9968 6.86312 15.875 6.16634C16.7533 5.46955 17.2116 4.27949 17.2501 2.59616H18.75C18.7308 4.03718 18.3878 5.26314 17.7212 6.27404C17.0545 7.28492 16.0128 7.96151 14.5962 8.30381V21.7499H13.0962V15.8076H10.9039V21.7499L9.40391 21.75ZM12 5.88454C11.4885 5.88454 11.0529 5.70473 10.6933 5.34511C10.3337 4.98551 10.1539 4.54994 10.1539 4.03841C10.1539 3.52686 10.3337 3.09128 10.6933 2.73168C11.0529 2.37207 11.4885 2.19226 12 2.19226C12.5116 2.19226 12.9471 2.37207 13.3068 2.73168C13.6664 3.09128 13.8462 3.52686 13.8462 4.03841C13.8462 4.54994 13.6664 4.98551 13.3068 5.34511C12.9471 5.70473 12.5116 5.88454 12 5.88454Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconVisitingSpeaker;
