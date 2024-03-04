import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconResizeHandle = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-resize-handle" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4274_140267"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4274_140267)">
          <path d="M6.96395 18.0709L5.90332 17.0103L16.5099 6.40369L17.5705 7.46431L6.96395 18.0709Z" fill={color} />
          <path d="M11.0337 17.5366L12.0943 18.5972L18.0969 12.5947L17.0362 11.5341L11.0337 17.5366Z" fill={color} />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconResizeHandle;
