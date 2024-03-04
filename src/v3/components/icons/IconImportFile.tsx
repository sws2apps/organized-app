import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconImportFile = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-import-file" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2513_2694"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2513_2694)">
          <path
            d="M11.25 18.885H12.7499V14.4504L14.6 16.3004L15.6538 15.2312L12 11.5774L8.34615 15.2312L9.41535 16.285L11.25 14.4504V18.885ZM6.3077 22.0004C5.80257 22.0004 5.375 21.8254 5.025 21.4754C4.675 21.1254 4.5 20.6979 4.5 20.1927V4.80819C4.5 4.30306 4.675 3.87549 5.025 3.52549C5.375 3.17549 5.80257 3.00049 6.3077 3.00049H14.25L19.5 8.25044V20.1927C19.5 20.6979 19.325 21.1254 18.975 21.4754C18.625 21.8254 18.1974 22.0004 17.6922 22.0004H6.3077ZM13.5 9.00044V4.50046H6.3077C6.23077 4.50046 6.16024 4.53251 6.09612 4.59661C6.03202 4.66073 5.99997 4.73126 5.99997 4.80819V20.1927C5.99997 20.2697 6.03202 20.3402 6.09612 20.4043C6.16024 20.4684 6.23077 20.5005 6.3077 20.5005H17.6922C17.7692 20.5005 17.8397 20.4684 17.9038 20.4043C17.9679 20.3402 18 20.2697 18 20.1927V9.00044H13.5Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconImportFile;
