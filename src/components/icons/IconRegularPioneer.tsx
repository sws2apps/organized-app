import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconRegularPioneer = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-regular-pioneer ${className}`}
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
          id="mask0_3298_119085"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3298_119085)">
          <path
            d="M8.79032 22.0005L6.97581 18.9517L3.53055 18.1993L3.86687 14.6632L1.53223 12.0005L3.86687 9.33773L3.53055 5.80167L6.97581 5.04924L8.79032 2.00049L12.0322 3.37282L15.2741 2.00049L17.0886 5.04924L20.5339 5.80167L20.1976 9.33773L22.5322 12.0005L20.1976 14.6632L20.5339 18.1993L17.0886 18.9517L15.2741 22.0005L12.0322 20.6282L8.79032 22.0005ZM9.43948 20.059L12.0322 18.9635L14.6563 20.059L16.0993 17.6262L18.8954 16.9869L18.6412 14.1292L20.5222 12.0005L18.6412 9.84063L18.8954 6.98293L16.0993 6.37474L14.625 3.94198L12.0322 5.03751L9.40819 3.94198L7.96517 6.37474L5.16907 6.98293L5.42326 9.84063L3.54224 12.0005L5.42326 14.1292L5.16907 17.0181L7.96517 17.6262L9.43948 20.059ZM10.9646 15.248L16.3574 9.87183L15.2859 8.77242L10.9646 13.0804L8.77858 10.9323L7.70709 12.0005L10.9646 15.248Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRegularPioneer;
