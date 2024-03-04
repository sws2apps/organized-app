import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCustomSchedule = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-custom-schedule" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4417_164286"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4417_164286)">
          <path
            d="M3.25 3.75049H10.75V11.2504H3.25V3.75049ZM13.25 3.75049H20.75V11.2504H13.25V3.75049ZM3.25 13.7505H10.75V21.2504H3.25V13.7505ZM16.25 13.7505H17.75V16.7505H20.75V18.2504H17.75V21.2504H16.25V18.2504H13.25V16.7505H16.25V13.7505ZM14.75 5.25044V9.75049H19.25V5.25044H14.75ZM4.74995 5.25044V9.75049H9.25V5.25044H4.74995ZM4.74995 15.2504V19.7505H9.25V15.2504H4.74995Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCustomSchedule;
