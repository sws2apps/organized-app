import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconLanguageGroup = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-language-group ${className}`}
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
          id="mask0_9626_208521"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_9626_208521)">
          <path
            d="M4 20.8941V9.6442L11.5 4L19 9.6442V11.7038H17.5V10.3942L11.5 5.87495L5.49998 10.3942V19.3942H7.69038C7.69038 19.672 7.69038 19.8787 7.69038 20.1364C7.69038 20.3942 7.69038 20.5998 7.69038 20.8941H4Z"
            fill={color}
          />
          <mask
            id="mask1_9626_208521"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="8"
            y="10"
            width="13"
            height="13"
          >
            <rect
              x="8.47021"
              y="10.9062"
              width="11.625"
              height="11.625"
              fill="#D9D9D9"
            />
          </mask>
          <g mask="url(#mask1_9626_208521)">
            <path
              d="M13.9809 21.795L16.1985 15.6677H17.6879L19.9055 21.795H18.5393L18.1281 20.6052H15.7446L15.3335 21.795L13.9809 21.795ZM10.2981 20.4035L9.39405 19.4995L11.7991 17.0945C11.4709 16.7572 11.186 16.4057 10.9446 16.0402C10.7031 15.6746 10.4946 15.2823 10.3191 14.8632H11.7333C11.8582 15.105 11.9991 15.3316 12.156 15.5429C12.3129 15.7542 12.4953 15.9701 12.7031 16.1905C12.9603 15.9149 13.222 15.5564 13.4881 15.1149C13.7541 14.6733 13.953 14.2665 14.0846 13.8944H8.68066V12.6108H12.0713V11.6421H13.3549V12.6108H16.7455V13.8944H15.4367C15.258 14.4529 14.9957 15.0366 14.6498 15.6456C14.3039 16.2545 13.9518 16.7433 13.5934 17.1119L14.4273 17.9632L13.9477 19.3052L12.6894 18.0174L10.2981 20.4035ZM16.1432 19.4426H17.7227L16.9329 17.1503L16.1432 19.4426Z"
              fill={color}
            />
          </g>
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLanguageGroup;
