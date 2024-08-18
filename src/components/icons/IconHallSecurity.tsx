import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconHallSecurity = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-hall-security ${className}`}
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
          id="mask0_4432_164535"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4432_164535)">
          <path
            d="M12 21.4813C9.83716 20.8916 8.04646 19.6185 6.62787 17.6621C5.20929 15.7057 4.5 13.5185 4.5 11.1006V5.34674L12 2.53906L19.5 5.34674V11.1006C19.5 13.5185 18.7907 15.7057 17.3721 17.6621C15.9535 19.6185 14.1628 20.8916 12 21.4813ZM12 19.9006C13.6166 19.4006 14.9666 18.4131 16.05 16.9381C17.1333 15.4631 17.7666 13.8172 17.95 12.0006H12V4.13519L5.99997 6.37556V11.5409C5.99997 11.664 6.01664 11.8172 6.04997 12.0006H12V19.9006Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconHallSecurity;
