import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconRefresh = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-refresh ${className}`}
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
          id="mask0_2706_33636"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2706_33636)">
          <path
            d="M12.0412 19.959C9.79639 19.959 7.89497 19.1841 6.33698 17.6344C4.77899 16.0848 4 14.1935 4 11.9606C4 9.72773 4.77899 7.83591 6.33698 6.28515C7.89497 4.73437 9.79639 3.95898 12.0412 3.95898C13.2949 3.95898 14.4811 4.23626 15.6 4.7908C16.7189 5.34533 17.6495 6.1279 18.3917 7.13851V3.95898H20V10.482H13.4433V8.88207H17.6784C17.1134 7.85232 16.3299 7.04103 15.3278 6.44819C14.3258 5.85537 13.2302 5.55896 12.0412 5.55896C10.2543 5.55896 8.73538 6.18119 7.48452 7.42564C6.23366 8.67008 5.60823 10.1812 5.60823 11.959C5.60823 13.7368 6.23366 15.2479 7.48452 16.4923C8.73538 17.7368 10.2543 18.359 12.0412 18.359C13.4172 18.359 14.6591 17.9679 15.767 17.1857C16.8749 16.4034 17.6523 15.3723 18.099 14.0923H19.7938C19.3072 15.8332 18.3488 17.2462 16.9185 18.3313C15.4883 19.4164 13.8625 19.959 12.0412 19.959Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRefresh;
