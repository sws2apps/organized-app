import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSchoolForEvangelizers = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-school-for-evangelizers ${className}`}
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
          id="mask0_2799_54676"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2799_54676)">
          <path
            d="M12 21.808C10.8384 20.7837 9.53076 19.9891 8.07693 19.4244C6.62308 18.8596 5.09743 18.5516 3.5 18.5004V8.32733C5.10642 8.3722 6.64135 8.70681 8.1048 9.33118C9.56825 9.95555 10.8666 10.7914 12 11.8389C13.1333 10.7914 14.4317 9.95555 15.8952 9.33118C17.3586 8.70681 18.8935 8.3722 20.5 8.32733V18.5004C18.8923 18.5516 17.3641 18.8596 15.9154 19.4244C14.4666 19.9891 13.1615 20.7837 12 21.808ZM12 19.8812C13.05 19.1042 14.1666 18.481 15.35 18.0116C16.5333 17.5422 17.75 17.232 19 17.0812V9.98883C17.7384 10.2055 16.517 10.635 15.3356 11.2773C14.1541 11.9196 13.0423 12.7619 12 13.8042C10.9577 12.7619 9.84582 11.9196 8.6644 11.2773C7.483 10.635 6.26153 10.2055 4.99997 9.98883V17.0812C6.24998 17.232 7.46664 17.5422 8.64998 18.0116C9.83331 18.481 10.95 19.1042 12 19.8812ZM12 8.78883C11.0058 8.78883 10.1546 8.43482 9.44663 7.72681C8.73863 7.01881 8.38462 6.1677 8.38462 5.17348C8.38462 4.17925 8.73863 3.32813 9.44663 2.62013C10.1546 1.91211 11.0058 1.55811 12 1.55811C12.9942 1.55811 13.8453 1.91211 14.5533 2.62013C15.2613 3.32813 15.6153 4.17925 15.6153 5.17348C15.6153 6.1677 15.2613 7.01881 14.5533 7.72681C13.8453 8.43482 12.9942 8.78883 12 8.78883ZM12.0003 7.28886C12.5821 7.28886 13.0801 7.08169 13.4942 6.66736C13.9083 6.25304 14.1154 5.75496 14.1154 5.17313C14.1154 4.5913 13.9082 4.09333 13.4939 3.67923C13.0795 3.26513 12.5815 3.05808 11.9996 3.05808C11.4178 3.05808 10.9199 3.26525 10.5058 3.67958C10.0916 4.09391 9.88458 4.59199 9.88458 5.17381C9.88458 5.75564 10.0917 6.2536 10.5061 6.66771C10.9204 7.08181 11.4185 7.28886 12.0003 7.28886Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSchoolForEvangelizers;
