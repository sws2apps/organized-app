import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconDrawShape = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-draw-shape" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2981213"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2981213)">
          <path
            d="M15.25 22.2505V19.8466L8.05768 16.2504H3.25V10.7505H7.41538L10.25 7.49661V2.75049H15.75V8.25044H11.5846L8.74995 11.5043V14.9043L15.25 18.1543V16.7505H20.75V22.2504L15.25 22.2505ZM11.75 6.75046H14.25V4.25041H11.75V6.75046ZM4.74995 14.7505H7.25V12.2504H4.74995V14.7505ZM16.75 20.7505H19.25V18.2504H16.75V20.7505Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDrawShape;
