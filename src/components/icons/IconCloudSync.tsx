import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCloudSync = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-cloud_sync"
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
          id="mask0_2621_40478"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2621_40478)">
          <path
            d="M4.32692 19.6737V18.1738H7.23462C6.21154 17.2866 5.45833 16.3327 4.975 15.3122C4.49167 14.2917 4.25 13.2007 4.25 12.0392C4.25 10.2879 4.76698 8.73019 5.80095 7.36609C6.83492 6.00199 8.15125 5.07891 9.74995 4.59686V6.17759C8.57047 6.63272 7.60893 7.39362 6.86535 8.46029C6.12175 9.52697 5.74995 10.7199 5.74995 12.0392C5.74995 12.9968 5.94675 13.8789 6.34035 14.6853C6.73393 15.4917 7.35766 16.2725 8.21153 17.0277V14.2892H9.7115V19.6737H4.32692ZM15 19.7507C14.2436 19.7507 13.5961 19.4814 13.0577 18.943C12.5192 18.4045 12.25 17.7571 12.25 17.0007C12.25 16.2648 12.501 15.6334 13.0029 15.1065C13.5048 14.5795 14.1429 14.2994 14.9173 14.2661C15.1814 13.6725 15.583 13.1882 16.1221 12.8132C16.6612 12.4382 17.2872 12.2507 18 12.2507C18.8513 12.2507 19.5881 12.5302 20.2106 13.0892C20.833 13.6481 21.2013 14.3687 21.3154 15.2507H21.4692C22.0987 15.2507 22.6362 15.4667 23.0817 15.8988C23.5272 16.3308 23.75 16.8565 23.75 17.4757C23.75 18.1052 23.5323 18.6417 23.0971 19.0853C22.6618 19.5289 22.1295 19.7507 21.5 19.7507H15ZM18.15 10.8661C18.0077 10.1443 17.7554 9.47888 17.3933 8.86991C17.0311 8.26093 16.4961 7.63207 15.7884 6.98334V9.71221H14.2885V4.32764H19.673V5.82759H16.7653C17.6551 6.61479 18.3243 7.42056 18.773 8.24491C19.2217 9.06928 19.5192 9.943 19.6654 10.8661H18.15ZM15 18.2507H21.5C21.7038 18.2507 21.8798 18.1767 22.0279 18.0286C22.176 17.8805 22.25 17.7045 22.25 17.5007C22.25 17.2968 22.176 17.1209 22.0279 16.9728C21.8798 16.8247 21.7038 16.7507 21.5 16.7507H20V15.7507C20 15.1968 19.8051 14.725 19.4154 14.3353C19.0256 13.9455 18.5538 13.7507 18 13.7507C17.4461 13.7507 16.9791 13.9311 16.599 14.292C16.2189 14.6529 16.0224 15.0879 16.0096 15.5968V15.7507H15C14.6525 15.7507 14.3573 15.8721 14.1144 16.1151C13.8714 16.3581 13.75 16.6533 13.75 17.0007C13.75 17.3481 13.8714 17.6433 14.1144 17.8863C14.3573 18.1292 14.6525 18.2507 15 18.2507Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCloudSync;
