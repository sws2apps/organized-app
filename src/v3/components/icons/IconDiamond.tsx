import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconDiamond = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-diamond" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2513_2687"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2513_2687)">
          <path
            d="M12.0002 21.1062L2.29834 9.46199L6.15409 3.75049H17.8464L21.7021 9.46199L12.0002 21.1062ZM9.22136 8.75049H14.7791L13.0291 5.25044H10.9714L9.22136 8.75049ZM11.2503 17.8678V10.2504H4.92136L11.2503 17.8678ZM12.7502 17.8678L19.0791 10.2504H12.7502V17.8678ZM16.4464 8.75049H19.6541L16.9041 5.25044H14.6964L16.4464 8.75049ZM4.34636 8.75049H7.55409L9.30411 5.25044H7.09639L4.34636 8.75049Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDiamond;
