import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconParking = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-parking"
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
          id="mask0_4944_2980560"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980560)">
          <path
            d="M4.84171 21.0922C4.30142 21.0922 3.8441 20.9051 3.46974 20.5307C3.09538 20.1563 2.9082 19.699 2.9082 19.1587V4.84269C2.9082 4.3024 3.09538 3.84507 3.46974 3.47072C3.8441 3.09636 4.30142 2.90918 4.84171 2.90918H19.1577C19.698 2.90918 20.1554 3.09636 20.5297 3.47072C20.9041 3.84507 21.0913 4.3024 21.0913 4.84269V19.1587C21.0913 19.699 20.9041 20.1563 20.5297 20.5307C20.1554 20.9051 19.698 21.0922 19.1577 21.0922H4.84171ZM4.84171 19.4879H19.1577C19.24 19.4879 19.3155 19.4536 19.384 19.385C19.4526 19.3164 19.4869 19.241 19.4869 19.1587V4.84269C19.4869 4.7604 19.4526 4.68497 19.384 4.61639C19.3155 4.54783 19.24 4.51355 19.1577 4.51355H4.84171C4.75942 4.51355 4.68399 4.54783 4.61541 4.61639C4.54685 4.68497 4.51257 4.7604 4.51257 4.84269V19.1587C4.51257 19.241 4.54685 19.3164 4.61541 19.385C4.68399 19.4536 4.75942 19.4879 4.84171 19.4879Z"
            fill={color}
          />
          <path
            d="M8.82812 17.2516V6.74951H12.8436C13.7822 6.74951 14.5831 7.08117 15.2464 7.74448C15.9097 8.4078 16.2414 9.20872 16.2414 10.1473C16.2414 11.0858 15.9097 11.8867 15.2464 12.55C14.5831 13.2133 13.7822 13.545 12.8436 13.545H10.6814V17.2516H8.82812ZM10.6814 11.6917H12.9197C13.3444 11.6917 13.708 11.5405 14.0104 11.238C14.3129 10.9356 14.4641 10.572 14.4641 10.1473C14.4641 9.72253 14.3129 9.35894 14.0104 9.05648C13.708 8.75403 13.3444 8.6028 12.9197 8.6028H10.6814V11.6917Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconParking;
