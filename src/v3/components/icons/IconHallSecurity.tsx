import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconHallSecurity = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-hall-security" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4432_164535"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4432_164535)">
          <path
            d="M12 21.9813C9.83716 21.3916 8.04646 20.1185 6.62787 18.1621C5.20929 16.2057 4.5 14.0185 4.5 11.6006V5.84674L12 3.03906L19.5 5.84674V11.6006C19.5 14.0185 18.7907 16.2057 17.3721 18.1621C15.9535 20.1185 14.1628 21.3916 12 21.9813ZM12 20.4006C13.6166 19.9006 14.9666 18.9131 16.05 17.4381C17.1333 15.9631 17.7666 14.3172 17.95 12.5006H12V4.63519L5.99997 6.87556V12.0409C5.99997 12.164 6.01664 12.3172 6.04997 12.5006H12V20.4006Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconHallSecurity;
