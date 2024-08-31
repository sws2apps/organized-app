import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconDiagnosis = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-diagnosis ${className}`}
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
          id="mask0_13161_343583"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_13161_343583)">
          <path
            d="M14 14.307H19V12.807H14V14.307ZM14 11.4995H20V9.99951H14V11.4995ZM8.25 16.1553C9.3115 15.1936 10.2019 14.3766 10.9212 13.7043C11.6404 13.0318 12 12.2802 12 11.4495C12 10.9135 11.809 10.4545 11.427 10.0725C11.0448 9.69051 10.5858 9.49951 10.05 9.49951C9.64867 9.49951 9.30633 9.58635 9.023 9.76001C8.73967 9.93368 8.482 10.1648 8.25 10.4533C8.018 10.1648 7.76033 9.93368 7.477 9.76001C7.19367 9.58635 6.85133 9.49951 6.45 9.49951C5.91417 9.49951 5.45517 9.69051 5.073 10.0725C4.691 10.4545 4.5 10.9135 4.5 11.4495C4.5 12.2802 4.84708 13.0193 5.54125 13.6668C6.23558 14.3141 7.1385 15.1436 8.25 16.1553ZM21.6922 21.5H3.30775C2.80258 21.5 2.375 21.325 2.025 20.975C1.675 20.625 1.5 20.1974 1.5 19.6923V5.30775C1.5 4.80258 1.675 4.375 2.025 4.025C2.375 3.675 2.80258 3.5 3.30775 3.5H21.6922C22.1974 3.5 22.625 3.675 22.975 4.025C23.325 4.375 23.5 4.80258 23.5 5.30775V19.6923C23.5 20.1974 23.325 20.625 22.975 20.975C22.625 21.325 22.1974 21.5 21.6922 21.5ZM3.30775 20H21.6922C21.7821 20 21.8558 19.9712 21.9135 19.9135C21.9712 19.8558 22 19.7821 22 19.6923V5.30775C22 5.21792 21.9712 5.14417 21.9135 5.0865C21.8558 5.02883 21.7821 5 21.6922 5H3.30775C3.21792 5 3.14417 5.02883 3.0865 5.0865C3.02883 5.14417 3 5.21792 3 5.30775V19.6923C3 19.7821 3.02883 19.8558 3.0865 19.9135C3.14417 19.9712 3.21792 20 3.30775 20Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDiagnosis;
