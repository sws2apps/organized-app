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
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2513_2687)">
          <path
            d="M12.0002 20.6057L2.29834 8.9615L6.15409 3.25H17.8464L21.7021 8.9615L12.0002 20.6057ZM9.22136 8.25H14.7791L13.0291 4.74995H10.9714L9.22136 8.25ZM11.2503 17.3673V9.74995H4.92136L11.2503 17.3673ZM12.7502 17.3673L19.0791 9.74995H12.7502V17.3673ZM16.4464 8.25H19.6541L16.9041 4.74995H14.6964L16.4464 8.25ZM4.34636 8.25H7.55409L9.30411 4.74995H7.09639L4.34636 8.25Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDiamond;
