import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconRefresh = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-refresh" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2706_33636"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2706_33636)">
          <path
            d="M12.0412 20.459C9.79639 20.459 7.89497 19.6841 6.33698 18.1344C4.77899 16.5848 4 14.6935 4 12.4606C4 10.2277 4.77899 8.33591 6.33698 6.78515C7.89497 5.23437 9.79639 4.45898 12.0412 4.45898C13.2949 4.45898 14.4811 4.73626 15.6 5.2908C16.7189 5.84533 17.6495 6.6279 18.3917 7.63851V4.45898H20V10.982H13.4433V9.38207H17.6784C17.1134 8.35232 16.3299 7.54103 15.3278 6.94819C14.3258 6.35537 13.2302 6.05896 12.0412 6.05896C10.2543 6.05896 8.73538 6.68119 7.48452 7.92564C6.23366 9.17008 5.60823 10.6812 5.60823 12.459C5.60823 14.2368 6.23366 15.7479 7.48452 16.9923C8.73538 18.2368 10.2543 18.859 12.0412 18.859C13.4172 18.859 14.6591 18.4679 15.767 17.6857C16.8749 16.9034 17.6523 15.8723 18.099 14.5923H19.7938C19.3072 16.3332 18.3488 17.7462 16.9185 18.8313C15.4883 19.9164 13.8625 20.459 12.0412 20.459Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRefresh;
