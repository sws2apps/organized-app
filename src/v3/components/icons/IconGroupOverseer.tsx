import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconGroupOverseer = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-group-overseer"
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
          id="mask0_3105_848"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3105_848)">
          <path
            d="M12 22.2888L9.21153 19.5004H5.3077C4.80257 19.5004 4.375 19.3254 4.025 18.9754C3.675 18.6254 3.5 18.1979 3.5 17.6927V4.30819C3.5 3.80305 3.675 3.37549 4.025 3.02549C4.375 2.67549 4.80257 2.50049 5.3077 2.50049H18.6923C19.1974 2.50049 19.625 2.67549 19.975 3.02549C20.325 3.37549 20.5 3.80305 20.5 4.30819V17.6927C20.5 18.1979 20.325 18.6254 19.975 18.9754C19.625 19.3254 19.1974 19.5004 18.6923 19.5004H14.7884L12 22.2888ZM4.99997 17.0428C5.89998 16.1594 6.94581 15.4636 8.13748 14.9553C9.32914 14.4469 10.6166 14.1928 12 14.1928C13.3833 14.1928 14.6708 14.4469 15.8625 14.9553C17.0541 15.4636 18.1 16.1594 19 17.0428V4.30816C19 4.23123 18.9679 4.1607 18.9038 4.09659C18.8397 4.03249 18.7692 4.00044 18.6923 4.00044H5.3077C5.23077 4.00044 5.16024 4.03249 5.09612 4.09659C5.03202 4.1607 4.99997 4.23123 4.99997 4.30816V17.0428ZM12 12.0389C12.9025 12.0389 13.6698 11.7229 14.3019 11.0908C14.9339 10.4588 15.25 9.69148 15.25 8.78891C15.25 7.88636 14.9339 7.11906 14.3019 6.48701C13.6698 5.85496 12.9025 5.53894 12 5.53894C11.0974 5.53894 10.3301 5.85496 9.69808 6.48701C9.06603 7.11906 8.75 7.88636 8.75 8.78891C8.75 9.69148 9.06603 10.4588 9.69808 11.0908C10.3301 11.7229 11.0974 12.0389 12 12.0389ZM6.44225 18.0004H17.5577V17.7889C16.768 17.0838 15.9016 16.5581 14.9587 16.212C14.0157 15.8658 13.0295 15.6927 12 15.6927C10.9833 15.6927 10.0019 15.8642 9.05573 16.2072C8.10956 16.5501 7.2384 17.0709 6.44225 17.7697V18.0004ZM12 10.5389C11.5192 10.5389 11.1073 10.3675 10.7644 10.0245C10.4214 9.68156 10.25 9.2697 10.25 8.78891C10.25 8.30815 10.4214 7.89629 10.7644 7.55334C11.1073 7.21039 11.5192 7.03891 12 7.03891C12.4807 7.03891 12.8926 7.21039 13.2356 7.55334C13.5785 7.89629 13.75 8.30815 13.75 8.78891C13.75 9.2697 13.5785 9.68156 13.2356 10.0245C12.8926 10.3675 12.4807 10.5389 12 10.5389Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconGroupOverseer;
