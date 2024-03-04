import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCloudDownload = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-cloud_download" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2621_40482"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2621_40482)">
          <path
            d="M6.49998 20.0002C5.11794 20.0002 3.9391 19.5201 2.96345 18.5599C1.98782 17.5996 1.5 16.4285 1.5 15.0464C1.5 13.8233 1.89167 12.7355 2.675 11.783C3.45833 10.8304 4.45769 10.267 5.67308 10.0926C5.89873 8.87337 6.56379 7.7333 7.66828 6.6724C8.77276 5.6115 9.96667 5.08105 11.25 5.08105C11.659 5.08105 12.0112 5.22881 12.3067 5.52433C12.6022 5.81983 12.75 6.17206 12.75 6.58103V13.2465L14.5808 11.4464L15.6346 12.5003L12 16.1349L8.36538 12.5003L9.4192 11.4464L11.25 13.2465V6.58103C9.98973 6.72461 8.96633 7.30346 8.1798 8.31756C7.39325 9.33166 6.99998 10.3926 6.99998 11.5003H6.49998C5.53331 11.5003 4.70831 11.8419 4.02498 12.5253C3.34164 13.2086 2.99998 14.0336 2.99998 15.0003C2.99998 15.9669 3.34164 16.7919 4.02498 17.4753C4.70831 18.1586 5.53331 18.5003 6.49998 18.5003H18.5C19.2 18.5003 19.7916 18.2586 20.275 17.7753C20.7583 17.2919 21 16.7003 21 16.0003C21 15.3003 20.7583 14.7086 20.275 14.2253C19.7916 13.7419 19.2 13.5003 18.5 13.5003H17V11.5003C17 10.6874 16.8166 9.9352 16.45 9.24353C16.0833 8.55186 15.6 7.97077 15 7.50025V5.7426C16.0859 6.29389 16.9407 7.08747 17.5644 8.12336C18.1881 9.15926 18.5 10.2849 18.5 11.5003V12.0003H18.8077C19.8615 12.0823 20.7403 12.506 21.4442 13.2714C22.148 14.0368 22.5 14.9464 22.5 16.0003C22.5 17.1156 22.1121 18.0611 21.3365 18.8368C20.5609 19.6124 19.6153 20.0002 18.5 20.0002H6.49998Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCloudDownload;
