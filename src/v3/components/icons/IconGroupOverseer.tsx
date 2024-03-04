import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconGroupOverseer = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-group-overseer" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3105_848"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3105_848)">
          <path
            d="M12 22.7888L9.21153 20.0004H5.3077C4.80257 20.0004 4.375 19.8254 4.025 19.4754C3.675 19.1254 3.5 18.6979 3.5 18.1927V4.80819C3.5 4.30305 3.675 3.87549 4.025 3.52549C4.375 3.17549 4.80257 3.00049 5.3077 3.00049H18.6923C19.1974 3.00049 19.625 3.17549 19.975 3.52549C20.325 3.87549 20.5 4.30305 20.5 4.80819V18.1927C20.5 18.6979 20.325 19.1254 19.975 19.4754C19.625 19.8254 19.1974 20.0004 18.6923 20.0004H14.7884L12 22.7888ZM4.99997 17.5428C5.89998 16.6594 6.94581 15.9636 8.13748 15.4553C9.32914 14.9469 10.6166 14.6928 12 14.6928C13.3833 14.6928 14.6708 14.9469 15.8625 15.4553C17.0541 15.9636 18.1 16.6594 19 17.5428V4.80816C19 4.73123 18.9679 4.6607 18.9038 4.59659C18.8397 4.53249 18.7692 4.50044 18.6923 4.50044H5.3077C5.23077 4.50044 5.16024 4.53249 5.09612 4.59659C5.03202 4.6607 4.99997 4.73123 4.99997 4.80816V17.5428ZM12 12.5389C12.9025 12.5389 13.6698 12.2229 14.3019 11.5908C14.9339 10.9588 15.25 10.1915 15.25 9.28891C15.25 8.38636 14.9339 7.61906 14.3019 6.98701C13.6698 6.35496 12.9025 6.03894 12 6.03894C11.0974 6.03894 10.3301 6.35496 9.69808 6.98701C9.06603 7.61906 8.75 8.38636 8.75 9.28891C8.75 10.1915 9.06603 10.9588 9.69808 11.5908C10.3301 12.2229 11.0974 12.5389 12 12.5389ZM6.44225 18.5004H17.5577V18.2889C16.768 17.5838 15.9016 17.0581 14.9587 16.712C14.0157 16.3658 13.0295 16.1927 12 16.1927C10.9833 16.1927 10.0019 16.3642 9.05573 16.7072C8.10956 17.0501 7.2384 17.5709 6.44225 18.2697V18.5004ZM12 11.0389C11.5192 11.0389 11.1073 10.8675 10.7644 10.5245C10.4214 10.1816 10.25 9.7697 10.25 9.28891C10.25 8.80815 10.4214 8.39629 10.7644 8.05334C11.1073 7.71039 11.5192 7.53891 12 7.53891C12.4807 7.53891 12.8926 7.71039 13.2356 8.05334C13.5785 8.39629 13.75 8.80815 13.75 9.28891C13.75 9.7697 13.5785 10.1816 13.2356 10.5245C12.8926 10.8675 12.4807 11.0389 12 11.0389Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconGroupOverseer;
