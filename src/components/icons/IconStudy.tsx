import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconStudy = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-study ${className}`}
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
          id="mask0_2457_21496"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2457_21496)">
          <path
            d="M7.64703 20.8476C6.80216 20.8476 6.08134 20.5492 5.48456 19.9524C4.88776 19.3556 4.58936 18.6348 4.58936 17.7899V5.09766C4.58936 4.19509 4.90538 3.42778 5.53743 2.79573C6.16948 2.16368 6.93679 1.84766 7.83936 1.84766H19.5893V16.2322C19.1598 16.2322 18.7928 16.3845 18.4883 16.689C18.1838 16.9935 18.0316 17.3604 18.0316 17.7899C18.0316 18.2194 18.1838 18.5864 18.4883 18.8909C18.7928 19.1954 19.1598 19.3476 19.5893 19.3476V20.8476H7.64703ZM6.08933 15.1919C6.31625 15.0368 6.55951 14.9214 6.81913 14.8457C7.07875 14.7701 7.35471 14.7323 7.64703 14.7323H8.28166V3.34763H7.83936C7.35857 3.34763 6.94671 3.51911 6.60376 3.86206C6.26081 4.20501 6.08933 4.61687 6.08933 5.09766V15.1919ZM9.78161 14.7323H18.0893V3.34763H9.78161V14.7323ZM7.64703 19.3476H16.9913C16.8464 19.1207 16.7336 18.88 16.6528 18.6255C16.572 18.371 16.5316 18.0925 16.5316 17.7899C16.5316 17.504 16.5695 17.2297 16.6451 16.9669C16.7207 16.704 16.8361 16.4592 16.9913 16.2322H7.64703C7.20088 16.2322 6.82972 16.3845 6.53356 16.689C6.23741 16.9935 6.08933 17.3604 6.08933 17.7899C6.08933 18.2361 6.23741 18.6072 6.53356 18.9034C6.82972 19.1996 7.20088 19.3476 7.64703 19.3476Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconStudy;
