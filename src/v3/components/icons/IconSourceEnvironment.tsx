import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconSourceEnvironment = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-source_environment" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2980561"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980561)">
          <path
            d="M2.36523 21.0776V4.82755L7.11521 1.38525L11.8652 4.82755V7.57758H21.6344V21.0776H2.36523ZM3.86518 19.5776H6.36521V17.0776H3.86518V19.5776ZM3.86518 15.5776H6.36521V13.0776H3.86518V15.5776ZM3.86518 11.5776H6.36521V9.07755H3.86518V11.5776ZM3.86518 7.57758H6.36521V5.07755H3.86518V7.57758ZM7.86518 7.57758H10.3652V5.07755H7.86518V7.57758ZM7.86518 19.5776H20.1344V9.07755H7.86518V19.5776ZM14.0575 13.0776V11.5776H17.7498V13.0776H14.0575ZM14.0575 17.0776V15.5776H17.7498V17.0776H14.0575ZM10.3652 13.0776V11.5776H11.8652V13.0776H10.3652ZM10.3652 17.0776V15.5776H11.8652V17.0776H10.3652Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSourceEnvironment;
