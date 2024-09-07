import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconTranslate = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-translate ${className}`}
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
          id="mask0_13161_343573"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_13161_343573)">
          <path
            d="M11.9193 21.231L16.1231 10.1541H18.05L22.2538 21.231H20.3269L19.3538 18.4118H14.8693L13.8654 21.231H11.9193ZM15.4308 16.7964H18.7423L17.1269 12.231H17.0462L15.4308 16.7964ZM4.63468 18.4618L3.33085 17.1579L7.9962 12.4926C7.41415 11.8503 6.90486 11.183 6.46833 10.4907C6.0318 9.79836 5.65135 9.0708 5.327 8.30798H7.2539C7.53467 8.8631 7.83146 9.36149 8.14428 9.80316C8.4571 10.2448 8.83594 10.7131 9.2808 11.208C9.96285 10.4657 10.5279 9.70732 10.976 8.93296C11.4241 8.15861 11.7987 7.3349 12.1 6.46183H1.86548V4.61568H8.32698V2.76953H10.1731V4.61568H16.6346V6.46183H13.9462C13.6218 7.549 13.1837 8.60765 12.6318 9.63778C12.0798 10.6679 11.3975 11.6362 10.5847 12.5426L12.7923 14.8002L12.1 16.6964L9.25005 13.8464L4.63468 18.4618Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconTranslate;
