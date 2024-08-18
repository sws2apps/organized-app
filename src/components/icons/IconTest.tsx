import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconTest = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-test ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_10351_268771"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_10351_268771)">
          <path
            d="M2 11.7505V10.2505H5V11.7505H2ZM5.2269 17.3582L4.1731 16.2736L6.2731 14.1736L7.35768 15.2274L5.2269 17.3582ZM6.2731 7.82739L4.1731 5.72739L5.2269 4.64281L7.35768 6.77359L6.2731 7.82739ZM17.4807 19.2504L12.8846 14.6543L11.7885 17.9812L9.19233 9.36589L17.8461 11.962L14.5499 13.1274L19.0768 17.6543L17.4807 19.2504ZM10.0577 6.00049V3.00049H11.5577V6.00049H10.0577ZM15.3423 7.82739L14.2577 6.77359L16.3885 4.64281L17.4423 5.69664L15.3423 7.82739Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconTest;
