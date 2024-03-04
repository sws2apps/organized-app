import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconSent = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-sent" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2936_42672"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2936_42672)">
          <path
            d="M15.7192 22.135L11.8154 18.2313L12.8692 17.1774L15.7192 20.0274L21.3884 14.3582L22.4423 15.412L15.7192 22.135ZM12 11.5005L19.8461 6.50046H4.15383L12 11.5005ZM12 13.0581L3.99998 7.94274V18.1927C3.99998 18.2825 4.02883 18.3562 4.08653 18.4139C4.14423 18.4716 4.21795 18.5005 4.3077 18.5005H9.27498L10.775 20.0004H4.3077C3.80257 20.0004 3.375 19.8254 3.025 19.4754C2.675 19.1254 2.5 18.6979 2.5 18.1927V6.80819C2.5 6.30306 2.675 5.87549 3.025 5.52549C3.375 5.17549 3.80257 5.00049 4.3077 5.00049H19.6923C20.1974 5.00049 20.625 5.17549 20.975 5.52549C21.325 5.87549 21.5 6.30306 21.5 6.80819V11.4467L20 12.9466V7.94274L12 13.0581Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSent;
