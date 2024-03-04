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
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_5245_210951"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5245_210951)">
          <path
            d="M18.6923 21.0004C19.1974 21.0004 19.625 20.8254 19.975 20.4754C20.325 20.1254 20.5 19.6979 20.5 19.1927V5.80819C20.5 5.30306 20.325 4.87549 19.975 4.52549C19.625 4.17549 19.1974 4.00049 18.6923 4.00049H11.9904V5.50046H18.6923C18.7692 5.50046 18.8398 5.53251 18.9039 5.59661C18.968 5.66073 19 5.73126 19 5.80819V19.1927C19 19.2697 18.968 19.3402 18.9039 19.4043C18.8398 19.4684 18.7692 19.5005 18.6923 19.5005H11.9904V21.0004H18.6923Z"
            fill={color}
          />
          <path
            d="M9.5962 15.6852L10.6346 16.7698L14.9038 12.5006L10.6346 8.23145L9.5962 9.31602L12.0308 11.7506H3.5V13.2506H12.0308L9.5962 15.6852Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLogin;
