import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCongregation = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-congregation" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2674_26323"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2674_26323)">
          <path
            d="M20.7408 13.3942L19.2768 19.0102H17.6208L16.7248 15.3142L15.7968 19.0102H14.1408L12.7168 13.3942H14.1808L14.9888 17.4822L15.9888 13.3942H17.4928L18.4528 17.4822L19.2688 13.3942H20.7408Z"
            fill={color}
          />
          <path
            d="M12.308 13.3942V17.2182C12.308 17.8102 12.14 18.2662 11.804 18.5862C11.4733 18.9062 11.0253 19.0662 10.46 19.0662C9.868 19.0662 9.39333 18.8982 9.036 18.5622C8.67867 18.2262 8.5 17.7488 8.5 17.1302H9.86C9.86 17.3648 9.908 17.5435 10.004 17.6662C10.1 17.7835 10.2387 17.8422 10.42 17.8422C10.5853 17.8422 10.7133 17.7888 10.804 17.6822C10.8947 17.5755 10.94 17.4208 10.94 17.2182V13.3942H12.308Z"
            fill={color}
          />
          <path
            d="M4 20.8941V9.6442L11.5 4L19 9.6442V11.7038H17.5V10.3942L11.5 5.87495L5.49998 10.3942V19.3942H7.69038C7.69038 19.672 7.69038 19.8787 7.69038 20.1364C7.69038 20.3942 7.69038 20.5998 7.69038 20.8941H4Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCongregation;
