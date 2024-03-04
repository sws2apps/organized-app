import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconDashedLine = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-dashed-line" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2979629"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2979629)">
          <path
            d="M4.58691 5.08747C4.58691 5.08747 11.4187 5.23278 15.4159 9.59343C19.4131 13.9541 19.4131 19.9136 19.4131 19.9136"
            stroke="#222222"
            stroke-width="1.5"
            stroke-dasharray="3 2"
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDashedLine;
