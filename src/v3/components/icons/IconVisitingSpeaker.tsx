import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconVisitingSpeaker = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-visiting-speaker" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2515_25885"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2515_25885)">
          <path
            d="M4.44238 22.2506V16.7506H6.94233V22.2505L4.44238 22.2506ZM9.40391 22.2506V9.97552C8.46801 10.2589 7.80935 10.7685 7.42793 11.5044C7.0465 12.2403 6.82694 13.0916 6.76926 14.0582H5.26928C5.32698 12.0788 5.95358 10.5262 7.14908 9.40057C8.3446 8.27494 9.96158 7.71212 12 7.71212C13.7052 7.71212 14.9968 7.36373 15.875 6.66695C16.7533 5.97016 17.2116 4.7801 17.2501 3.09677H18.75C18.7308 4.53779 18.3878 5.76375 17.7212 6.77465C17.0545 7.78553 16.0128 8.46212 14.5962 8.80442V22.2505H13.0962V16.3082H10.9039V22.2505L9.40391 22.2506ZM12 6.38515C11.4885 6.38515 11.0529 6.20534 10.6933 5.84572C10.3337 5.48612 10.1539 5.05055 10.1539 4.53902C10.1539 4.02747 10.3337 3.5919 10.6933 3.2323C11.0529 2.87268 11.4885 2.69287 12 2.69287C12.5116 2.69287 12.9471 2.87268 13.3068 3.2323C13.6664 3.5919 13.8462 4.02747 13.8462 4.53902C13.8462 5.05055 13.6664 5.48612 13.3068 5.84572C12.9471 6.20534 12.5116 6.38515 12 6.38515Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconVisitingSpeaker;
