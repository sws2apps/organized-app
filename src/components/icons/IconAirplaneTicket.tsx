import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconAirplaneTicket = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-airplane-ticket ${className}`}
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
          id="mask0_13161_343484"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_13161_343484)">
          <path
            d="M8.8885 15.5345L17.6923 13.2037C17.9294 13.1436 18.1122 13.0055 18.2405 12.7895C18.3687 12.5735 18.4026 12.3501 18.3422 12.1192C18.2821 11.8884 18.1459 11.7202 17.9337 11.6145C17.7216 11.5087 17.5001 11.4859 17.2693 11.5463L14.7807 12.2155L10.7808 8.4655L9.55375 8.75775L11.9537 12.9578L9.38075 13.5963L8.13075 12.6463L7.35375 12.8577L8.8885 15.5345ZM19.6923 19.5H4.30775C3.80908 19.5 3.38308 19.3234 3.02975 18.9703C2.67658 18.6169 2.5 18.1909 2.5 17.6923V14.404C3.06933 14.295 3.545 14.0157 3.927 13.5662C4.309 13.1169 4.5 12.5948 4.5 12C4.5 11.4052 4.309 10.8831 3.927 10.4337C3.545 9.98425 3.06933 9.705 2.5 9.596V6.30775C2.5 5.80908 2.67658 5.38308 3.02975 5.02975C3.38308 4.67658 3.80908 4.5 4.30775 4.5H19.6923C20.1909 4.5 20.6169 4.67658 20.9703 5.02975C21.3234 5.38308 21.5 5.80908 21.5 6.30775V17.6923C21.5 18.1909 21.3234 18.6169 20.9703 18.9703C20.6169 19.3234 20.1909 19.5 19.6923 19.5ZM19.6923 18C19.7821 18 19.8558 17.9712 19.9135 17.9135C19.9712 17.8558 20 17.7821 20 17.6923V6.30775C20 6.21792 19.9712 6.14417 19.9135 6.0865C19.8558 6.02883 19.7821 6 19.6923 6H4.30775C4.21792 6 4.14417 6.02883 4.0865 6.0865C4.02883 6.14417 4 6.21792 4 6.30775V8.55C4.61667 8.91667 5.10417 9.40417 5.4625 10.0125C5.82083 10.6208 6 11.2833 6 12C6 12.7167 5.82083 13.3792 5.4625 13.9875C5.10417 14.5958 4.61667 15.0833 4 15.45V17.6923C4 17.7821 4.02883 17.8558 4.0865 17.9135C4.14417 17.9712 4.21792 18 4.30775 18H19.6923Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAirplaneTicket;
