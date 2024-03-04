import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconBack = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-back" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3114_66176"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3114_66176)">
          <path
            d="M9.99039 18.1448L4.34619 12.5006L9.99039 6.85645L11.0346 7.90065L7.21919 11.7507H19.6538V13.2506H7.20959L11.0596 17.1006L9.99039 18.1448Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconBack;
