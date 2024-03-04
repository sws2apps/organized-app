import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconUndo = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-undo" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2697_32275"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2697_32275)">
          <path
            d="M7.20193 19.0004V17.5005H14.3789C15.4224 17.5005 16.3205 17.1559 17.0731 16.4668C17.8256 15.7777 18.2019 14.9267 18.2019 13.9139C18.2019 12.9011 17.8256 12.0517 17.0731 11.3658C16.3205 10.6799 15.4224 10.337 14.3789 10.337H7.35762L10.1403 13.1197L9.08652 14.1735L4.5 9.58701L9.08652 5.00049L10.1403 6.05431L7.35762 8.83704H14.3789C15.8417 8.83704 17.0945 9.32517 18.1375 10.3014C19.1804 11.2777 19.7019 12.4819 19.7019 13.9139C19.7019 15.346 19.1804 16.5517 18.1375 17.5312C17.0945 18.5107 15.8417 19.0004 14.3789 19.0004H7.20193Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconUndo;
