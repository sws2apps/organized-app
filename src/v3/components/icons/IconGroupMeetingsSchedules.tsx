import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconGroupMeetingsSchedules = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-group-meetings-schedules" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3258_161975"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3258_161975)">
          <path
            d="M9.35935 17.5004C8.26833 17.5004 7.42636 17.0863 6.83343 16.2581C6.24048 15.4299 5.95746 14.4498 5.98438 13.3178V13.2312L5.45745 12.4216C5.1972 12.0165 4.88663 11.3267 4.52573 10.3524C4.16482 9.378 3.98438 8.2607 3.98438 7.00046C3.98438 5.42483 4.3629 4.11426 5.11995 3.06876C5.877 2.02325 6.8318 1.50049 7.98435 1.50049C9.20228 1.50049 10.1734 2.06235 10.8978 3.18606C11.6221 4.30976 11.9843 5.58123 11.9843 7.00046C11.9843 7.92225 11.8494 8.8027 11.5795 9.64181C11.3096 10.4809 11.0619 11.1665 10.8362 11.6985L11.1613 12.2351C11.3266 12.5133 11.5052 12.8793 11.6968 13.3332C11.8885 13.787 11.9843 14.2344 11.9843 14.6755C11.9843 15.4844 11.7366 16.1575 11.2411 16.6947C10.7456 17.2318 10.1183 17.5004 9.35935 17.5004ZM6.91705 11.8889L9.36895 11.3486C9.59845 10.8152 9.84173 10.1572 10.0988 9.37451C10.3558 8.59181 10.4844 7.80046 10.4844 7.00046C10.4844 5.962 10.2504 5.03571 9.78243 4.22161C9.31448 3.40751 8.71512 3.00046 7.98435 3.00046C7.25358 3.00046 6.65423 3.40751 6.18628 4.22161C5.71832 5.03571 5.48435 5.962 5.48435 7.00046C5.48435 8.00558 5.63499 8.94436 5.93628 9.81681C6.23756 10.6892 6.56448 11.38 6.91705 11.8889ZM9.35935 16.0005C9.68243 16.0005 9.9507 15.8806 10.1642 15.6408C10.3776 15.4011 10.4844 15.0793 10.4844 14.6755C10.4844 14.3921 10.4129 14.0844 10.2699 13.7524C10.127 13.4203 9.95678 13.0992 9.75935 12.7889L7.48435 13.3081C7.48435 14.0774 7.6382 14.7184 7.9459 15.2312C8.25358 15.7441 8.72473 16.0005 9.35935 16.0005ZM17.6094 22.5004C16.8504 22.5004 16.2232 22.2318 15.7277 21.6947C15.2321 21.1575 14.9844 20.4844 14.9844 19.6755C14.9844 19.2344 15.0802 18.787 15.2719 18.3332C15.4635 17.8793 15.6421 17.5133 15.8075 17.2351L16.1325 16.6985C15.9132 16.1729 15.6671 15.4889 15.394 14.6466C15.1209 13.8043 14.9844 12.9222 14.9844 12.0005C14.9844 10.5812 15.3466 9.30976 16.0709 8.18606C16.7953 7.06235 17.7664 6.50049 18.9844 6.50049C20.1369 6.50049 21.0917 7.02325 21.8488 8.06876C22.6058 9.11426 22.9843 10.4248 22.9843 12.0005C22.9843 13.2607 22.8055 14.3722 22.4478 15.335C22.0901 16.2979 21.7779 16.9882 21.5113 17.4062L20.9843 18.2312V18.3274C21.001 19.4402 20.7138 20.4139 20.1228 21.2485C19.5318 22.0831 18.694 22.5004 17.6094 22.5004ZM20.0132 16.9466C20.4363 16.2838 20.7872 15.5556 21.0661 14.762C21.3449 13.9684 21.4844 13.0479 21.4844 12.0005C21.4844 10.962 21.2504 10.0357 20.7824 9.22161C20.3145 8.40751 19.7151 8.00046 18.9844 8.00046C18.2536 8.00046 17.6542 8.40751 17.1863 9.22161C16.7183 10.0357 16.4844 10.962 16.4844 12.0005C16.4844 12.8005 16.6145 13.5876 16.8748 14.362C17.135 15.1364 17.3767 15.7986 17.5998 16.3486L20.0132 16.9466ZM17.6094 21.0005C18.2311 21.0005 18.6991 20.7473 19.0132 20.2408C19.3273 19.7344 19.4844 19.1126 19.4844 18.3755L17.219 17.7793C17.0664 18.0511 16.9058 18.3546 16.7373 18.6899C16.5687 19.0251 16.4844 19.3537 16.4844 19.6755C16.4844 20.0152 16.5917 20.321 16.8065 20.5928C17.0212 20.8646 17.2888 21.0005 17.6094 21.0005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconGroupMeetingsSchedules;
