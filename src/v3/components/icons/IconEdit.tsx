import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconEdit = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-edit" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2538_44048"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2538_44048)">
          <path
            d="M4.99997 19.5005H6.2615L16.4981 9.26389L15.2366 8.00236L4.99997 18.2389V19.5005ZM3.5 21.0004V17.6159L16.6904 4.43126C16.8416 4.29391 17.0086 4.18778 17.1913 4.11286C17.374 4.03795 17.5656 4.00049 17.7661 4.00049C17.9666 4.00049 18.1608 4.03607 18.3488 4.10724C18.5368 4.17839 18.7032 4.29152 18.848 4.44664L20.0692 5.68316C20.2243 5.82803 20.3349 5.99473 20.4009 6.18326C20.4669 6.37178 20.5 6.5603 20.5 6.74881C20.5 6.9499 20.4656 7.1418 20.3969 7.32451C20.3283 7.50725 20.219 7.67422 20.0692 7.82544L6.88458 21.0004H3.5ZM15.8563 8.64419L15.2366 8.00236L16.4981 9.26389L15.8563 8.64419Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconEdit;
