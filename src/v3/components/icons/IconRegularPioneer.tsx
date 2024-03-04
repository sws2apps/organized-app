import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconRegularPioneer = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-regular-pioneer" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3298_119085"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3298_119085)">
          <path
            d="M8.81176 22.366L7.02716 19.3583L3.63871 18.616L3.96949 15.1275L1.67334 12.5006L3.96949 9.8737L3.63871 6.38525L7.02716 5.64295L8.81176 2.63525L12.0002 3.9891L15.1887 2.63525L16.9733 5.64295L20.3617 6.38525L20.0309 9.8737L22.3271 12.5006L20.0309 15.1275L20.3617 18.616L16.9733 19.3583L15.1887 22.3659L12.0002 21.0121L8.81176 22.366ZM9.45022 20.4506L12.0002 19.3698L14.581 20.4506L16.0002 18.0506L18.7502 17.4198L18.5002 14.6006L20.3502 12.5006L18.5002 10.3698L18.7502 7.5506L16.0002 6.9506L14.5502 4.5506L12.0002 5.63138L9.41944 4.5506L8.00022 6.9506L5.25021 7.5506L5.50021 10.3698L3.65021 12.5006L5.50021 14.6006L5.25021 17.4506L8.00022 18.0506L9.45022 20.4506ZM10.9502 15.7044L16.254 10.4006L15.2002 9.31601L10.9502 13.566L8.80022 11.4468L7.74639 12.5006L10.9502 15.7044Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRegularPioneer;
