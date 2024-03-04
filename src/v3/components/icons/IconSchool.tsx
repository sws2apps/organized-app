import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconSchool = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-school" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2799_54675"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2799_54675)">
          <path
            d="M12 20.3467L5.50007 16.816V11.3929L2.03857 9.50066L12 4.07764L21.9615 9.50066V16.6929H20.4616V10.3314L18.5 11.3929V16.816L12 20.3467ZM12 13.2007L18.8404 9.50066L12 5.80066L5.15967 9.50066L12 13.2007ZM12 18.6391L17.0001 15.9391V12.1929L12 14.9219L7.00005 12.1929V15.9391L12 18.6391Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSchool;
