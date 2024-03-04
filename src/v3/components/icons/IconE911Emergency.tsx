import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconE911Emergency = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-e911_emergency" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_5060_176866"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5060_176866)">
          <path
            d="M5.34618 20.0005V18.5005H6.87888L8.80577 12.0409C8.91989 11.6461 9.13848 11.3323 9.46155 11.0996C9.78462 10.8669 10.1436 10.7505 10.5385 10.7505H13.4615C13.8564 10.7505 14.2154 10.8669 14.5385 11.0996C14.8615 11.3323 15.0801 11.6461 15.1942 12.0409L17.1211 18.5005H18.6538V20.0005H5.34618ZM8.4596 18.5005H15.5404L13.75 12.4717C13.7308 12.4012 13.6939 12.3467 13.6394 12.3082C13.5849 12.2697 13.5224 12.2505 13.4519 12.2505H10.5481C10.4776 12.2505 10.4151 12.2697 10.3606 12.3082C10.3061 12.3467 10.2692 12.4012 10.25 12.4717L8.4596 18.5005ZM11.25 8.44282V3.94287H12.75V8.44282H11.25ZM16.95 10.812L15.8808 9.74285L19.075 6.57365L20.1192 7.61785L16.95 10.812ZM18.25 15.4428V13.9429H22.75V15.4428H18.25ZM7.05 10.812L3.8808 7.61785L4.925 6.57365L8.1192 9.74285L7.05 10.812ZM1.25 15.4428V13.9429H5.75V15.4428H1.25Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconE911Emergency;
