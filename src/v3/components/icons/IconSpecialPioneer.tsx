import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconSpecialPioneer = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-special-pioneer" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3298_119084"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3298_119084)">
          <path
            d="M9.29616 15.9038L12 14.2634L14.7038 15.9038L13.9865 12.8288L16.3846 10.7615L13.2288 10.4961L12 7.59616L10.7711 10.4961L7.61538 10.7615L10.0135 12.8288L9.29616 15.9038ZM12 22.6076L8.86153 19.5H4.50001V15.1384L1.39233 12L4.50001 8.86153V4.50001H8.86153L12 1.39233L15.1384 4.50001H19.5V8.86153L22.6076 12L19.5 15.1384V19.5H15.1384L12 22.6076ZM12 20.5L14.5 18H18V14.5L20.5 12L18 9.49998V5.99998H14.5L12 3.49998L9.49998 5.99998H5.99998V9.49998L3.49998 12L5.99998 14.5V18H9.49998L12 20.5Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSpecialPioneer;
