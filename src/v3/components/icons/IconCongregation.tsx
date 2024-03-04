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
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2674_26323)">
          <path
            d="M20.7408 13.8945L19.2768 19.5105H17.6208L16.7248 15.8145L15.7968 19.5105H14.1408L12.7168 13.8945H14.1808L14.9888 17.9825L15.9888 13.8945H17.4928L18.4528 17.9825L19.2688 13.8945H20.7408Z"
            fill={color}
          />
          <path
            d="M12.308 13.8945V17.7185C12.308 18.3105 12.14 18.7665 11.804 19.0865C11.4733 19.4065 11.0253 19.5665 10.46 19.5665C9.868 19.5665 9.39333 19.3985 9.036 19.0625C8.67867 18.7265 8.5 18.2492 8.5 17.6305H9.86C9.86 17.8652 9.908 18.0439 10.004 18.1665C10.1 18.2839 10.2387 18.3425 10.42 18.3425C10.5853 18.3425 10.7133 18.2892 10.804 18.1825C10.8947 18.0759 10.94 17.9212 10.94 17.7185V13.8945H12.308Z"
            fill={color}
          />
          <path
            d="M4 21.3946V10.1447L11.5 4.50049L19 10.1447V12.2043H17.5V10.8947L11.5 6.37544L5.49998 10.8947V19.8947H7.69038C7.69038 20.1725 7.69038 20.3792 7.69038 20.6369C7.69038 20.8947 7.69038 21.1003 7.69038 21.3946H4Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCongregation;
