import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCall = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-call" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3196_82422"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3196_82422)">
          <path
            d="M19.4403 21.0004C17.5557 21.0004 15.6625 20.5623 13.7606 19.686C11.8586 18.8097 10.1112 17.5735 8.51828 15.9774C6.92533 14.3812 5.69071 12.6338 4.81442 10.7351C3.93814 8.83637 3.5 6.94471 3.5 5.06011C3.5 4.75736 3.6 4.50507 3.8 4.30324C4 4.10141 4.25 4.00049 4.55 4.00049H7.8115C8.06407 4.00049 8.28683 4.08286 8.47977 4.24761C8.67272 4.41236 8.79548 4.61589 8.84803 4.85819L9.4211 7.80046C9.46085 8.07355 9.45252 8.30816 9.3961 8.50431C9.3397 8.70046 9.23842 8.86521 9.09225 8.99854L6.78265 11.2466C7.15445 11.9274 7.57913 12.5713 8.0567 13.1783C8.53427 13.7854 9.05125 14.3652 9.60765 14.9178C10.1564 15.4665 10.7397 15.9761 11.3577 16.4466C11.9756 16.9172 12.6429 17.355 13.3596 17.7601L15.6038 15.4966C15.7602 15.3338 15.9497 15.2197 16.1721 15.1543C16.3945 15.089 16.6256 15.0729 16.8654 15.1063L19.6423 15.6716C19.8948 15.7383 20.1009 15.8671 20.2605 16.0582C20.4201 16.2492 20.5 16.4659 20.5 16.7082V19.9504C20.5 20.2504 20.399 20.5004 20.1972 20.7004C19.9954 20.9004 19.7431 21.0004 19.4403 21.0004ZM6.07305 9.82741L7.85768 8.11971C7.88973 8.09406 7.91056 8.05881 7.92018 8.01394C7.92979 7.96906 7.92819 7.92739 7.91538 7.88894L7.48075 5.65431C7.46793 5.60303 7.4455 5.56457 7.41345 5.53894C7.3814 5.51329 7.33973 5.50046 7.28845 5.50046H5.14997C5.11152 5.50046 5.07948 5.51329 5.05383 5.53894C5.02818 5.56457 5.01535 5.59662 5.01535 5.63509C5.06663 6.31842 5.17849 7.01266 5.35092 7.71779C5.52337 8.42292 5.76408 9.12613 6.07305 9.82741ZM14.773 18.4697C15.4359 18.7787 16.1272 19.0149 16.8471 19.1784C17.567 19.3418 18.2397 19.4389 18.8654 19.4697C18.9038 19.4697 18.9359 19.4569 18.9615 19.4312C18.9872 19.4056 19 19.3735 19 19.3351V17.2312C19 17.18 18.9872 17.1383 18.9615 17.1062C18.9359 17.0742 18.8974 17.0517 18.8461 17.0389L16.7461 16.612C16.7077 16.5992 16.674 16.5976 16.6452 16.6072C16.6163 16.6168 16.5859 16.6376 16.5538 16.6697L14.773 18.4697Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCall;
