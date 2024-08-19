import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCongregation = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-congregation ${className}`}
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
          id="mask0_2674_26323"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2674_26323)">
          <path
            d="M20.7408 13.3945L19.2768 19.0105H17.6208L16.7248 15.3145L15.7968 19.0105H14.1408L12.7168 13.3945H14.1808L14.9888 17.4825L15.9888 13.3945H17.4928L18.4528 17.4825L19.2688 13.3945H20.7408Z"
            fill={color}
          />
          <path
            d="M12.308 13.3945V17.2185C12.308 17.8105 12.14 18.2665 11.804 18.5865C11.4733 18.9065 11.0253 19.0665 10.46 19.0665C9.868 19.0665 9.39333 18.8985 9.036 18.5625C8.67867 18.2265 8.5 17.7492 8.5 17.1305H9.86C9.86 17.3652 9.908 17.5439 10.004 17.6665C10.1 17.7839 10.2387 17.8425 10.42 17.8425C10.5853 17.8425 10.7133 17.7892 10.804 17.6825C10.8947 17.5759 10.94 17.4212 10.94 17.2185V13.3945H12.308Z"
            fill={color}
          />
          <path
            d="M4 20.8946V9.64469L11.5 4.00049L19 9.64469V11.7043H17.5V10.3947L11.5 5.87544L5.49998 10.3947V19.3947H7.69038C7.69038 19.6725 7.69038 19.8792 7.69038 20.1369C7.69038 20.3947 7.69038 20.6003 7.69038 20.8946H4Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCongregation;
