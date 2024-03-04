import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCompassOn = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-compass-on" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2979468"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2979468)">
          <path
            d="M11.9999 19.8163L14.4476 12.5005L11.9999 5.18469L9.55229 12.5005L11.9999 19.8163ZM12.707 13.2076C12.5067 13.4079 12.271 13.5081 11.9999 13.5081C11.7289 13.5081 11.4932 13.4079 11.2928 13.2076C11.0925 13.0072 10.9923 12.7715 10.9923 12.5005C10.9923 12.2294 11.0925 11.9937 11.2928 11.7934C11.4932 11.593 11.7289 11.4929 11.9999 11.4929C12.271 11.4929 12.5067 11.593 12.707 11.7934C12.9074 11.9937 13.0076 12.2294 13.0076 12.5005C13.0076 12.7715 12.9074 13.0072 12.707 13.2076ZM18.7186 19.2168C17.7895 20.1459 16.7399 20.8429 15.5698 21.3078C14.3997 21.7727 13.21 22.0053 12.0008 22.0056C10.7916 22.0058 9.60204 21.7738 8.43212 21.3094C7.26221 20.845 6.21271 20.1483 5.28362 19.2192C4.35453 18.2901 3.65754 17.2405 3.19264 16.0704C2.72773 14.9002 2.49514 13.7106 2.49487 12.5014C2.49459 11.2922 2.72665 10.1026 3.19105 8.93268C3.65543 7.76277 4.35216 6.71327 5.28125 5.78418C6.21035 4.85508 7.25995 4.15809 8.43007 3.69319C9.60021 3.22828 10.7899 2.99569 11.9991 2.99542C13.2083 2.99515 14.3978 3.22721 15.5678 3.6916C16.7377 4.15598 17.7872 4.85272 18.7162 5.78181C19.6453 6.7109 20.3423 7.7605 20.8072 8.93062C21.2721 10.1008 21.5047 11.2904 21.505 12.4996C21.5053 13.7088 21.2732 14.8984 20.8088 16.0683C20.3444 17.2382 19.6477 18.2877 18.7186 19.2168ZM17.6568 18.1573C19.236 16.5781 20.0256 14.6925 20.0256 12.5005C20.0256 10.3085 19.236 8.42284 17.6568 6.84363C16.0776 5.26443 14.192 4.47483 11.9999 4.47483C9.80791 4.47483 7.92229 5.26443 6.34308 6.84363C4.76388 8.42284 3.97427 10.3085 3.97427 12.5005C3.97427 14.6925 4.76388 16.5781 6.34308 18.1573C7.92229 19.7365 9.80791 20.5262 11.9999 20.5262C14.192 20.5262 16.0776 19.7365 17.6568 18.1573Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCompassOn;
