import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconFilter = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-filter" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4451_159612"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4451_159612)">
          <path
            d="M11.3848 20.0004C11.1335 20.0004 10.9232 19.9158 10.754 19.7466C10.5847 19.5774 10.5001 19.3671 10.5001 19.1158V13.3274L4.90208 6.21586C4.70978 5.95945 4.6819 5.69278 4.81843 5.41586C4.95497 5.13895 5.18541 5.00049 5.50976 5.00049H18.4905C18.8148 5.00049 19.0452 5.13895 19.1818 5.41586C19.3183 5.69278 19.2904 5.95945 19.0981 6.21586L13.5001 13.3274V19.1158C13.5001 19.3671 13.4155 19.5774 13.2462 19.7466C13.077 19.9158 12.8667 20.0004 12.6155 20.0004H11.3848ZM12.0001 12.8005L16.9501 6.50046H7.05011L12.0001 12.8005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconFilter;
