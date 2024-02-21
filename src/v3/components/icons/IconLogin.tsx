import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconLogin = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-login" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_5245_210951"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5245_210951)">
          <path
            d="M18.6923 20.5C19.1974 20.5 19.625 20.325 19.975 19.975C20.325 19.625 20.5 19.1974 20.5 18.6923V5.3077C20.5 4.80257 20.325 4.375 19.975 4.025C19.625 3.675 19.1974 3.5 18.6923 3.5H11.9904V4.99998H18.6923C18.7692 4.99998 18.8398 5.03203 18.9039 5.09613C18.968 5.16024 19 5.23077 19 5.3077V18.6923C19 18.7692 18.968 18.8397 18.9039 18.9038C18.8398 18.9679 18.7692 19 18.6923 19H11.9904V20.5H18.6923Z"
            fill={color}
          />
          <path
            d="M9.5962 15.1846L10.6346 16.2692L14.9038 12L10.6346 7.73083L9.5962 8.81541L12.0308 11.25H3.5V12.75H12.0308L9.5962 15.1846Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLogin;
