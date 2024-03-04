import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconNoConnection = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-no-connection" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2515_24470"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2515_24470)">
          <path
            d="M19.8268 22.485L10.9845 13.5928C10.0858 13.7056 9.23643 13.9549 8.43642 14.3408C7.63642 14.7267 6.9409 15.2299 6.34987 15.8505L4.78837 14.2582C5.3794 13.6672 6.04575 13.1556 6.78742 12.7236C7.5291 12.2915 8.31405 11.9672 9.14227 11.7505L6.18067 8.78892C5.45887 9.11327 4.74604 9.51519 4.04219 9.99469C3.33834 10.4742 2.6909 11.0094 2.09987 11.6005L0.557617 10.0082C1.15505 9.41076 1.79255 8.86909 2.47012 8.38319C3.14768 7.89729 3.8307 7.4787 4.51917 7.12742L2.32302 4.93124L3.37684 3.87744L20.9306 21.4312L19.8268 22.485ZM11.9999 21.212C11.4345 21.212 10.9566 21.0142 10.5662 20.6187C10.1759 20.2232 9.98067 19.7479 9.98067 19.1928C9.98067 18.6274 10.1759 18.1495 10.5662 17.7591C10.9566 17.3688 11.4345 17.1736 11.9999 17.1736C12.5652 17.1736 13.0431 17.3688 13.4335 17.7591C13.8239 18.1495 14.0191 18.6274 14.0191 19.1928C14.0191 19.7479 13.8239 20.2232 13.4335 20.6187C13.0431 21.0142 12.5652 21.212 11.9999 21.212ZM17.8999 15.5505L13.9076 11.5582C14.8666 11.6916 15.8054 11.9868 16.7239 12.4438C17.6425 12.9008 18.4716 13.4992 19.2114 14.239L17.8999 15.5505ZM21.8999 11.6005C20.6165 10.3171 19.129 9.31297 17.4374 8.58797C15.7457 7.86297 13.9332 7.50047 11.9999 7.50047C11.6499 7.50047 11.3076 7.51297 10.9729 7.53797C10.6383 7.56297 10.314 7.60047 9.99987 7.65047L8.08452 5.73512C8.67042 5.58 9.28643 5.46366 9.93257 5.38609C10.5787 5.30852 11.2678 5.26974 11.9999 5.26974C14.2576 5.26974 16.3633 5.69058 18.3171 6.53224C20.271 7.37391 21.9857 8.53256 23.4614 10.0082L21.8999 11.6005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconNoConnection;
