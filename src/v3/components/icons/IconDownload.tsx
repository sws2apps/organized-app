import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconDownload = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-download" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4918_2971395"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4918_2971395)">
          <path
            d="M12 16.2889L7.7308 12.0197L8.78462 10.9351L11.25 13.4005V5.00049H12.7499V13.4005L15.2153 10.9351L16.2692 12.0197L12 16.2889ZM6.3077 20.0004C5.80257 20.0004 5.375 19.8254 5.025 19.4754C4.675 19.1254 4.5 18.6979 4.5 18.1927V15.4812H5.99997V18.1927C5.99997 18.2697 6.03202 18.3402 6.09612 18.4043C6.16024 18.4684 6.23077 18.5005 6.3077 18.5005H17.6922C17.7692 18.5005 17.8397 18.4684 17.9038 18.4043C17.9679 18.3402 18 18.2697 18 18.1927V15.4812H19.5V18.1927C19.5 18.6979 19.325 19.1254 18.975 19.4754C18.625 19.8254 18.1974 20.0004 17.6922 20.0004H6.3077Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDownload;
