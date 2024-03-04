import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconRegenerate = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-regenerate" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3204_169118"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3204_169118)">
          <path
            d="M11.9999 23.0005C10.1294 23.0005 8.40828 22.5447 6.83647 21.6332C5.26469 20.7216 3.98585 19.4409 2.99995 17.7908V21.0005H1.5V15.3082H7.18265V16.8082H4.17492C4.98646 18.2633 6.08325 19.4092 7.4653 20.2457C8.84737 21.0823 10.3589 21.5005 11.9999 21.5005C13.9487 21.5005 15.707 20.9297 17.275 19.788C18.8429 18.6464 19.9307 17.148 20.5384 15.2928L22.0076 15.6178C21.3217 17.8268 20.0589 19.6095 18.2192 20.9659C16.3794 22.3223 14.3063 23.0005 11.9999 23.0005ZM1.55 11.5005C1.67307 10.4223 1.9237 9.42043 2.3019 8.4948C2.6801 7.56917 3.21664 6.67622 3.91153 5.81595L4.99033 6.87555C4.45699 7.5653 4.03328 8.28004 3.71918 9.01977C3.40508 9.75952 3.18712 10.5864 3.06533 11.5005H1.55ZM6.39033 5.48517L5.33075 4.40635C6.17562 3.7243 7.07593 3.1852 8.0317 2.78905C8.98747 2.3929 9.97688 2.15316 10.9999 2.06982V3.56977C10.1692 3.65311 9.36566 3.85984 8.58938 4.18998C7.81309 4.52011 7.08008 4.95184 6.39033 5.48517ZM17.6057 5.48517C16.9609 4.96466 16.2349 4.53452 15.4278 4.19477C14.6208 3.85504 13.8115 3.64671 12.9999 3.56977V2.06982C14.0333 2.16341 15.0304 2.40732 15.9913 2.80155C16.9522 3.19578 17.8467 3.73392 18.6749 4.41595L17.6057 5.48517ZM20.9307 11.5005C20.8346 10.6121 20.6214 9.78356 20.2913 9.01498C19.9612 8.24638 19.5294 7.53644 18.9961 6.88517L20.0653 5.81595C20.7538 6.63133 21.2951 7.51947 21.6894 8.48037C22.0836 9.44126 22.3307 10.448 22.4307 11.5005H20.9307Z"
            fill={color}
          />
          <path d="M15.3461 11.2506L11.65 18.462V13.7505H8.6731L12.5 6.50061V11.2506H15.3461Z" fill={color} />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRegenerate;
