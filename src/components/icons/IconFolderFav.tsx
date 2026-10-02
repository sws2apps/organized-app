import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconFolderFav = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-folder-fav ${className}`}
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
          id="mask0_20561_395207"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_20561_395207)">
          <path
            d="M12.8115 16.402L14.9 14.8058L16.9885 16.402L16.2153 13.8115L18.3135 12.1155H15.723L14.9 9.575L14.077 12.1155H11.4865L13.5848 13.8115L12.8115 16.402ZM4.30775 19.5C3.80258 19.5 3.375 19.325 3.025 18.975C2.675 18.625 2.5 18.1974 2.5 17.6923V6.30775C2.5 5.80258 2.675 5.375 3.025 5.025C3.375 4.675 3.80258 4.5 4.30775 4.5H9.798L11.798 6.5H19.6923C20.1974 6.5 20.625 6.675 20.975 7.025C21.325 7.375 21.5 7.80258 21.5 8.30775V17.6923C21.5 18.1974 21.325 18.625 20.975 18.975C20.625 19.325 20.1974 19.5 19.6923 19.5H4.30775ZM4.30775 18H19.6923C19.7821 18 19.8558 17.9712 19.9135 17.9135C19.9712 17.8558 20 17.7821 20 17.6923V8.30775C20 8.21792 19.9712 8.14417 19.9135 8.0865C19.8558 8.02883 19.7821 8 19.6923 8H11.1845L9.1845 6H4.30775C4.21792 6 4.14417 6.02883 4.0865 6.0865C4.02883 6.14417 4 6.21792 4 6.30775V17.6923C4 17.7821 4.02883 17.8558 4.0865 17.9135C4.14417 17.9712 4.21792 18 4.30775 18Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconFolderFav;
