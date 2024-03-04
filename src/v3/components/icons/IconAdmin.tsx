import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconAdmin = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-admin" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3109_69418"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3109_69418)">
          <path
            d="M12 13.2505C11.0872 13.2505 10.3173 12.9371 9.69037 12.3102C9.06346 11.6832 8.75 10.9134 8.75 10.0006C8.75 9.08775 9.06346 8.31788 9.69037 7.69096C10.3173 7.06405 11.0872 6.75059 12 6.75059C12.9128 6.75059 13.6827 7.06405 14.3096 7.69096C14.9365 8.31788 15.25 9.08775 15.25 10.0006C15.25 10.9134 14.9365 11.6832 14.3096 12.3102C13.6827 12.9371 12.9128 13.2505 12 13.2505ZM12 11.7506C12.4974 11.7506 12.9134 11.5833 13.2481 11.2487C13.5827 10.914 13.75 10.498 13.75 10.0006C13.75 9.50313 13.5827 9.0871 13.2481 8.75246C12.9134 8.41785 12.4974 8.25054 12 8.25054C11.5025 8.25054 11.0865 8.41785 10.7519 8.75246C10.4173 9.0871 10.2499 9.50313 10.2499 10.0006C10.2499 10.498 10.4173 10.914 10.7519 11.2487C11.0865 11.5833 11.5025 11.7506 12 11.7506ZM12 21.9813C9.83716 21.3916 8.04646 20.1185 6.62787 18.1621C5.20929 16.2057 4.5 14.0185 4.5 11.6006V5.84674L12 3.03906L19.5 5.84674V11.6006C19.5 14.0185 18.7907 16.2057 17.3721 18.1621C15.9535 20.1185 14.1628 21.3916 12 21.9813ZM12 4.63519L5.99997 6.87556V11.6006C5.99997 12.5518 6.13619 13.4717 6.40863 14.3602C6.68108 15.2487 7.05961 16.0775 7.54422 16.8467C8.21857 16.5031 8.92466 16.2345 9.66248 16.041C10.4003 15.8474 11.1795 15.7506 12 15.7506C12.8205 15.7506 13.5997 15.8474 14.3375 16.041C15.0753 16.2345 15.7814 16.5031 16.4557 16.8467C16.9403 16.0775 17.3189 15.2487 17.5913 14.3602C17.8638 13.4717 18 12.5518 18 11.6006V6.87556L12 4.63519ZM12 17.2505C11.3551 17.2505 10.7349 17.3204 10.1394 17.4602C9.54388 17.5999 8.98137 17.7961 8.45187 18.0486C8.94804 18.5999 9.49388 19.0765 10.0894 19.4784C10.6849 19.8804 11.3218 20.1877 12 20.4006C12.6782 20.1877 13.3134 19.8804 13.9058 19.4784C14.4981 19.0765 15.0423 18.5999 15.5385 18.0486C15.009 17.7961 14.4481 17.5999 13.8558 17.4602C13.2634 17.3204 12.6449 17.2505 12 17.2505Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAdmin;
