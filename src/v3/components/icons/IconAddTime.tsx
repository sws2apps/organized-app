import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconAddTime = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-add-time" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2622_51905"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2622_51905)">
          <path
            d="M11.25 17.2504H12.75V13.2504H16.75V11.7505H12.75V7.75049H11.25V11.7505H7.25V13.2504H11.25V17.2504ZM12.0016 22.0004C10.6877 22.0004 9.45268 21.7511 8.29655 21.2524C7.1404 20.7538 6.13472 20.077 5.2795 19.2222C4.42427 18.3673 3.74721 17.3621 3.24833 16.2065C2.74944 15.0508 2.5 13.8161 2.5 12.5021C2.5 11.1882 2.74933 9.95317 3.248 8.79704C3.74667 7.64089 4.42342 6.63521 5.27825 5.77999C6.1331 4.92476 7.13834 4.2477 8.29398 3.74881C9.44959 3.24993 10.6844 3.00049 11.9983 3.00049C13.3122 3.00049 14.5473 3.24982 15.7034 3.74849C16.8596 4.24716 17.8652 4.92391 18.7205 5.77874C19.5757 6.63359 20.2527 7.63883 20.7516 8.79446C21.2505 9.95008 21.5 11.1849 21.5 12.4988C21.5 13.8127 21.2506 15.0478 20.752 16.2039C20.2533 17.36 19.5765 18.3657 18.7217 19.2209C17.8669 20.0762 16.8616 20.7532 15.706 21.2521C14.5504 21.751 13.3156 22.0004 12.0016 22.0004ZM12 20.5005C14.2333 20.5005 16.125 19.7255 17.675 18.1755C19.225 16.6255 20 14.7338 20 12.5005C20 10.2671 19.225 8.37546 17.675 6.82546C16.125 5.27546 14.2333 4.50046 12 4.50046C9.76664 4.50046 7.87498 5.27546 6.32498 6.82546C4.77498 8.37546 3.99998 10.2671 3.99998 12.5005C3.99998 14.7338 4.77498 16.6255 6.32498 18.1755C7.87498 19.7255 9.76664 20.5005 12 20.5005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAddTime;
