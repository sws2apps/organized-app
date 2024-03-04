import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconParticipate = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-participate" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3852_190637"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3852_190637)">
          <path
            d="M11.0016 22.0004C9.68772 22.0004 8.45268 21.7511 7.29655 21.2524C6.1404 20.7538 5.13472 20.077 4.2795 19.2222C3.42427 18.3673 2.74721 17.3621 2.24833 16.2065C1.74944 15.0508 1.5 13.8161 1.5 12.5021C1.5 11.1882 1.74937 9.95317 2.24812 8.79704C2.74688 7.64089 3.42375 6.63521 4.27875 5.77999C5.13375 4.92476 6.13917 4.2477 7.295 3.74881C8.45082 3.24993 9.68581 3.00049 11 3.00049C11.691 3.00049 12.3602 3.06972 13.0077 3.20819C13.6551 3.34666 14.2743 3.54922 14.8654 3.81589V5.49854C14.2948 5.18444 13.6845 4.93956 13.0345 4.76391C12.3844 4.58828 11.7062 4.50046 11 4.50046C8.78331 4.50046 6.89581 5.27963 5.33748 6.83796C3.77914 8.3963 2.99998 10.2838 2.99998 12.5005C2.99998 14.7171 3.77914 16.6046 5.33748 18.163C6.89581 19.7213 8.78331 20.5005 11 20.5005C13.2166 20.5005 15.1041 19.7213 16.6625 18.163C18.2208 16.6046 19 14.7171 19 12.5005C19 11.9928 18.9522 11.5002 18.8567 11.0226C18.7612 10.545 18.6282 10.0825 18.4577 9.63509H20.0692C20.2128 10.0928 20.3205 10.5571 20.3923 11.0279C20.4641 11.4988 20.5 11.9897 20.5 12.5005C20.5 13.8146 20.2506 15.0496 19.752 16.2054C19.2533 17.3613 18.5765 18.3667 17.7217 19.2217C16.8669 20.0767 15.8616 20.7536 14.706 21.2523C13.5504 21.7511 12.3156 22.0004 11.0016 22.0004ZM19.25 7.25044V5.25044H17.25V3.75049H19.25V1.75049H20.75V3.75049H22.75V5.25044H20.75V7.25044H19.25ZM14.4061 11.3081C14.7699 11.3081 15.0785 11.1808 15.3317 10.9261C15.5849 10.6714 15.7115 10.3621 15.7115 9.99819C15.7115 9.63432 15.5841 9.32579 15.3294 9.07259C15.0747 8.81939 14.7654 8.69279 14.4016 8.69279C14.0377 8.69279 13.7292 8.82015 13.476 9.07486C13.2227 9.32957 13.0961 9.63886 13.0961 10.0027C13.0961 10.3666 13.2235 10.6751 13.4782 10.9283C13.7329 11.1815 14.0422 11.3081 14.4061 11.3081ZM7.5984 11.3081C7.96227 11.3081 8.2708 11.1808 8.524 10.9261C8.77722 10.6714 8.90383 10.3621 8.90383 9.99819C8.90383 9.63432 8.77647 9.32579 8.52175 9.07259C8.26703 8.81939 7.95774 8.69279 7.59388 8.69279C7.23001 8.69279 6.92147 8.82015 6.66825 9.07486C6.41505 9.32957 6.28845 9.63886 6.28845 10.0027C6.28845 10.3666 6.41581 10.6751 6.67053 10.9283C6.92524 11.1815 7.23453 11.3081 7.5984 11.3081ZM11 17.6927C12.0529 17.6927 13.0091 17.4008 13.8685 16.8168C14.7279 16.2328 15.3628 15.4607 15.773 14.5005H6.22693C6.63718 15.4607 7.27201 16.2328 8.13143 16.8168C8.99083 17.4008 9.94701 17.6927 11 17.6927Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconParticipate;
