import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconLanguage = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-language ${className}`}
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
          id="mask0_2473_22725"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_22725)">
          <path
            d="M11.919 21.231L16.1228 10.1541H18.0498L22.2536 21.231H20.3267L19.3536 18.4118H14.869L13.8652 21.231H11.919ZM15.4305 16.7964H18.7421L17.1267 12.231H17.0459L15.4305 16.7964ZM4.63443 18.4618L3.33061 17.1579L7.99596 12.4926C7.41391 11.8503 6.90462 11.183 6.46808 10.4907C6.03155 9.79836 5.65111 9.0708 5.32676 8.30798H7.25366C7.53443 8.8631 7.83122 9.36149 8.14403 9.80316C8.45685 10.2448 8.83569 10.7131 9.28056 11.208C9.96261 10.4657 10.5277 9.70732 10.9758 8.93296C11.4238 8.15861 11.7985 7.3349 12.0998 6.46183H1.86523V4.61568H8.32674V2.76953H10.1729V4.61568H16.6344V6.46183H13.9459C13.6216 7.549 13.1834 8.60765 12.6315 9.63778C12.0796 10.6679 11.3972 11.6362 10.5844 12.5426L12.7921 14.8002L12.0998 16.6964L9.24981 13.8464L4.63443 18.4618Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLanguage;
