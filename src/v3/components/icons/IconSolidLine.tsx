import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconSolidLine = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-solid-line" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2979630"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2979630)">
          <path
            d="M18 20.5005C18 18.5671 17.6333 16.7505 16.9 15.0505C16.1667 13.3505 15.1667 11.8671 13.9 10.6005C12.6333 9.3338 11.15 8.3338 9.45 7.60046C7.75 6.86713 5.93333 6.50046 4 6.50046V5.00049C6.1359 5.00049 8.14422 5.40691 10.025 6.21974C11.9057 7.03256 13.5487 8.14152 14.9538 9.54664C16.3589 10.9518 17.4679 12.5947 18.2807 14.4755C19.0936 16.3562 19.5 18.3646 19.5 20.5005H18Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSolidLine;
