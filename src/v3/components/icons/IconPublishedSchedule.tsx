import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconPublishedSchedule = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-published-schedule" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3113_63302"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3113_63302)">
          <path
            d="M4.3077 20.5004C3.80257 20.5004 3.375 20.3254 3.025 19.9754C2.675 19.6254 2.5 19.1979 2.5 18.6927V5.30819C2.5 4.80306 2.675 4.37549 3.025 4.02549C3.375 3.67549 3.80257 3.50049 4.3077 3.50049H19.6923C20.1974 3.50049 20.625 3.67549 20.975 4.02549C21.325 4.37549 21.5 4.80306 21.5 5.30819V18.6927C21.5 19.1979 21.325 19.6254 20.975 19.9754C20.625 20.3254 20.1974 20.5004 19.6923 20.5004H4.3077ZM4.3077 19.0005H19.6923C19.7692 19.0005 19.8397 18.9684 19.9038 18.9043C19.9679 18.8402 20 18.7697 20 18.6927V5.30819C20 5.23126 19.9679 5.16073 19.9038 5.09661C19.8397 5.03251 19.7692 5.00046 19.6923 5.00046H4.3077C4.23077 5.00046 4.16024 5.03251 4.09613 5.09661C4.03202 5.16073 3.99998 5.23126 3.99998 5.30819V18.6927C3.99998 18.7697 4.03202 18.8402 4.09613 18.9043C4.16024 18.9684 4.23077 19.0005 4.3077 19.0005ZM5.25 16.7504H9.74995V15.2505H5.25V16.7504ZM14.55 14.6447L19.1442 10.0505L18.075 8.98126L14.55 12.5313L13.125 11.1063L12.0808 12.1755L14.55 14.6447ZM5.25 12.7504H9.74995V11.2505H5.25V12.7504ZM5.25 8.75044H9.74995V7.25049H5.25V8.75044Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPublishedSchedule;
