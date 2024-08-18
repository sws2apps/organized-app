import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconReportNotSent = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-report-not-sent ${className}`}
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
          id="mask0_3463_286010"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3463_286010)">
          <mask
            id="mask1_3463_286010"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="7"
            y="8"
            width="19"
            height="20"
          >
            <rect
              x="7.30151"
              y="8.43433"
              width="18.6859"
              height="18.6859"
              fill="#D9D9D9"
            />
          </mask>
          <g mask="url(#mask1_3463_286010)">
            <path
              d="M12.2844 23.3762L11.0454 22.1372L15.4054 17.7772L11.0454 13.4172L12.2844 12.1782L16.6444 16.5383L21.0044 12.1782L22.2434 13.4172L17.8833 17.7772L22.2434 22.1372L21.0044 23.3762L16.6444 19.0162L12.2844 23.3762Z"
              fill={color}
            />
          </g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.2743 17.8749H3.34212C3.25237 17.8749 3.17865 17.846 3.12095 17.7883C3.06325 17.7306 3.0344 17.6569 3.0344 17.5671V4.18258C3.0344 4.09283 3.06325 4.0191 3.12095 3.9614C3.17865 3.9037 3.25237 3.87485 3.34212 3.87485H16.7267C16.8164 3.87485 16.8902 3.9037 16.9479 3.9614C17.0056 4.0191 17.0344 4.09283 17.0344 4.18258V12.8749V13.4536L18.5344 11.9911V4.18258C18.5344 3.68386 18.3578 3.2579 18.0046 2.9047C17.6514 2.55149 17.2254 2.37488 16.7267 2.37488H3.34212C2.84341 2.37488 2.41745 2.55149 2.06425 2.9047C1.71103 3.2579 1.53442 3.68386 1.53442 4.18258V17.5671C1.53442 18.0658 1.71103 18.4918 2.06425 18.845C2.41745 19.1982 2.84341 19.3748 3.34212 19.3748H10.5207L12.2743 17.8749ZM5.47675 11.1056V12.6056H10.0344V11.1056H5.47675ZM5.47675 7.12488V8.62483H14.5921V7.12488H5.47675Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconReportNotSent;
