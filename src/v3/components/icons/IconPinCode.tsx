import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconPinCode = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-pin-code" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_5076_169482"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5076_169482)">
          <path
            d="M2.24996 19.2503V17.7504H21.75V19.2503H2.24996ZM3.09226 13.2388L2.06151 12.6427L2.96921 11.0465H1.15381V9.85421H2.96921L2.06151 8.30806L3.09226 7.71191L3.99996 9.25809L4.90766 7.71191L5.93841 8.30806L5.03071 9.85421H6.84611V11.0465H5.03071L5.93841 12.6427L4.90766 13.2388L3.99996 11.6426L3.09226 13.2388ZM11.0923 13.2388L10.0615 12.6427L10.9692 11.0465H9.15381V9.85421H10.9692L10.0615 8.30806L11.0923 7.71191L12 9.25809L12.9077 7.71191L13.9384 8.30806L13.0307 9.85421H14.8461V11.0465H13.0307L13.9384 12.6427L12.9077 13.2388L12 11.6426L11.0923 13.2388ZM19.0923 13.2388L18.0615 12.6427L18.9692 11.0465H17.1538V9.85421H18.9692L18.0615 8.30806L19.0923 7.71191L20 9.25809L20.9077 7.71191L21.9384 8.30806L21.0307 9.85421H22.8461V11.0465H21.0307L21.9384 12.6427L20.9077 13.2388L20 11.6426L19.0923 13.2388Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPinCode;
