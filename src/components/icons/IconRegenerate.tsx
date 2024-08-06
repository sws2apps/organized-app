import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconRegenerate = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-regenerate"
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
          id="mask0_3204_169118"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3204_169118)">
          <path
            d="M11.9999 22.5005C10.1294 22.5005 8.40828 22.0447 6.83647 21.1332C5.26469 20.2216 3.98585 18.9409 2.99995 17.2908V20.5005H1.5V14.8082H7.18265V16.3082H4.17492C4.98646 17.7633 6.08325 18.9092 7.4653 19.7457C8.84737 20.5823 10.3589 21.0005 11.9999 21.0005C13.9487 21.0005 15.707 20.4297 17.275 19.288C18.8429 18.1464 19.9307 16.648 20.5384 14.7928L22.0076 15.1178C21.3217 17.3268 20.0589 19.1095 18.2192 20.4659C16.3794 21.8223 14.3063 22.5005 11.9999 22.5005ZM1.55 11.0005C1.67307 9.92235 1.9237 8.92043 2.3019 7.9948C2.6801 7.06917 3.21664 6.17622 3.91153 5.31595L4.99033 6.37555C4.45699 7.0653 4.03328 7.78004 3.71918 8.51977C3.40508 9.25952 3.18712 10.0864 3.06533 11.0005H1.55ZM6.39033 4.98517L5.33075 3.90635C6.17562 3.2243 7.07593 2.6852 8.0317 2.28905C8.98747 1.8929 9.97688 1.65316 10.9999 1.56982V3.06977C10.1692 3.15311 9.36566 3.35984 8.58938 3.68998C7.81309 4.02011 7.08008 4.45184 6.39033 4.98517ZM17.6057 4.98517C16.9609 4.46466 16.2349 4.03452 15.4278 3.69477C14.6208 3.35504 13.8115 3.14671 12.9999 3.06977V1.56982C14.0333 1.66341 15.0304 1.90732 15.9913 2.30155C16.9522 2.69578 17.8467 3.23392 18.6749 3.91595L17.6057 4.98517ZM20.9307 11.0005C20.8346 10.1121 20.6214 9.28356 20.2913 8.51498C19.9612 7.74638 19.5294 7.03644 18.9961 6.38517L20.0653 5.31595C20.7538 6.13133 21.2951 7.01947 21.6894 7.98037C22.0836 8.94126 22.3307 9.94798 22.4307 11.0005H20.9307Z"
            fill={color}
          />
          <path
            d="M15.3461 10.7506L11.65 17.962V13.2505H8.6731L12.5 6.00061V10.7506H15.3461Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRegenerate;
