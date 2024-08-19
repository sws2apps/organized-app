import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconTreasuresPart = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-treasures-part ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.8831 27.0067L16 28.1592L15.1169 27.0067L4 12.4995L8.58359 4.00049L23.4164 4.00049L28 12.4995L16.8831 27.0067ZM20.5714 13.6018H25.3891L17.069 24.4593L20.5714 13.6018ZM21.0015 12.2684H26.2825L22.9781 6.14117L21.0015 12.2684ZM21.8154 5.40244L20.012 10.9928L16.6578 5.40244L21.8154 5.40244ZM19.1704 13.6018L15.9999 23.4303L12.8294 13.6018H19.1704ZM11.9878 10.9928L15.342 5.40244L10.1845 5.40244L11.9878 10.9928ZM9.02183 6.14137L10.9983 12.2684H5.71746L9.02183 6.14137ZM11.4284 13.6018L14.9307 24.4589L6.6109 13.6018H11.4284ZM15.9999 6.89751L19.2225 12.2684H12.7774L15.9999 6.89751Z"
          fill={color}
        />
      </svg>
    </SvgIcon>
  );
};

export default IconTreasuresPart;
