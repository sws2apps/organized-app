import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconEncryptionKey = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-encryption-key" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2704_35177"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2704_35177)">
          <path
            d="M6.55268 14.1158C6.10525 14.1158 5.72417 13.9584 5.40943 13.6437C5.0947 13.329 4.93733 12.9479 4.93733 12.5005C4.93733 12.053 5.0947 11.6719 5.40943 11.3572C5.72417 11.0425 6.10525 10.8851 6.55268 10.8851C7.00012 10.8851 7.3812 11.0425 7.69594 11.3572C8.01067 11.6719 8.16803 12.053 8.16803 12.5005C8.16803 12.9479 8.01067 13.329 7.69594 13.6437C7.3812 13.9584 7.00012 14.1158 6.55268 14.1158ZM6.55268 18.0004C5.02705 18.0004 3.72898 17.4652 2.65848 16.3947C1.58798 15.3242 1.05273 14.0261 1.05273 12.5005C1.05273 10.9748 1.58798 9.67676 2.65848 8.60626C3.72898 7.53575 5.02705 7.00049 6.55268 7.00049C7.62447 7.00049 8.59369 7.2771 9.46036 7.83031C10.327 8.38351 10.9886 9.1069 11.445 10.0005H20.4469L22.9469 12.5005L19.1008 16.3273L17.245 14.9331L15.3412 16.3466L13.3893 15.0004H11.445C10.9886 15.8876 10.327 16.6094 9.46036 17.1658C8.59369 17.7222 7.62447 18.0004 6.55268 18.0004ZM6.55268 16.5005C7.51167 16.5005 8.34212 16.2107 9.04403 15.6312C9.74595 15.0517 10.204 14.3415 10.4181 13.5005H13.8604L15.3008 14.4966L17.2546 13.0678L18.9527 14.3658L20.8181 12.5005L19.8181 11.5005H10.4181C10.204 10.6594 9.74595 9.94919 9.04403 9.36969C8.34212 8.79021 7.51167 8.50046 6.55268 8.50046C5.45268 8.50046 4.51102 8.89213 3.72768 9.67546C2.94435 10.4588 2.55268 11.4005 2.55268 12.5005C2.55268 13.6005 2.94435 14.5421 3.72768 15.3255C4.51102 16.1088 5.45268 16.5005 6.55268 16.5005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconEncryptionKey;
