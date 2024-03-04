import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconPanelOpen = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-panel-open" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2980681"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980681)">
          <path
            d="M12.4519 8.91396V16.087L16.048 12.5005L12.4519 8.91396ZM5.3077 21.0004C4.80898 21.0004 4.38302 20.8238 4.02982 20.4706C3.67661 20.1174 3.5 19.6915 3.5 19.1927V5.80819C3.5 5.30947 3.67661 4.88351 4.02982 4.53031C4.38302 4.1771 4.80898 4.00049 5.3077 4.00049H18.6923C19.191 4.00049 19.6169 4.1771 19.9701 4.53031C20.3233 4.88351 20.5 5.30947 20.5 5.80819V19.1927C20.5 19.6915 20.3233 20.1174 19.9701 20.4706C19.6169 20.8238 19.191 21.0004 18.6923 21.0004H5.3077ZM7.99998 19.5005V5.50046H5.3077C5.23077 5.50046 5.16024 5.53251 5.09612 5.59661C5.03202 5.66073 4.99997 5.73126 4.99997 5.80819V19.1927C4.99997 19.2697 5.03202 19.3402 5.09612 19.4043C5.16024 19.4684 5.23077 19.5005 5.3077 19.5005H7.99998ZM9.49995 19.5005H18.6923C18.7692 19.5005 18.8397 19.4684 18.9038 19.4043C18.9679 19.3402 19 19.2697 19 19.1927V5.80819C19 5.73126 18.9679 5.66073 18.9038 5.59661C18.8397 5.53251 18.7692 5.50046 18.6923 5.50046H9.49995V19.5005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPanelOpen;
