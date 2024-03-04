import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconHide = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-hide" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_5125_42608"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5125_42608)">
          <path
            d="M15.7731 13.4735L14.6501 12.3504C14.8001 11.5222 14.5639 10.7776 13.9414 10.1168C13.319 9.45586 12.5552 9.20041 11.6501 9.35041L10.527 8.22736C10.7527 8.12608 10.9841 8.05012 11.2212 7.99948C11.4584 7.94883 11.718 7.92351 12.0001 7.92351C13.1347 7.92351 14.0978 8.31934 14.8895 9.11101C15.6811 9.90268 16.077 10.8658 16.077 12.0004C16.077 12.2825 16.0517 12.5453 16.001 12.7889C15.9504 13.0324 15.8744 13.2606 15.7731 13.4735ZM18.9539 16.585L17.8501 15.5504C18.4834 15.0671 19.0459 14.5379 19.5376 13.9629C20.0292 13.3879 20.4501 12.7337 20.8001 12.0004C19.9667 10.3171 18.7709 8.97958 17.2126 7.98791C15.6542 6.99624 13.9167 6.50041 12.0001 6.50041C11.5167 6.50041 11.0417 6.53374 10.5751 6.60041C10.1084 6.66708 9.65007 6.76708 9.20007 6.90041L8.03472 5.73506C8.66677 5.48378 9.31228 5.29852 9.97125 5.17928C10.6302 5.06005 11.3065 5.00043 12.0001 5.00043C14.3437 5.00043 16.4571 5.64658 18.3404 6.93888C20.2238 8.2312 21.5975 9.91838 22.4616 12.0004C22.0911 12.894 21.6125 13.728 21.026 14.5023C20.4395 15.2767 19.7488 15.9709 18.9539 16.585ZM19.7616 22.3696L15.7155 18.3542C15.2027 18.544 14.6344 18.6991 14.0107 18.8196C13.3869 18.9401 12.7167 19.0004 12.0001 19.0004C9.65009 19.0004 7.53664 18.3542 5.65972 17.0619C3.78281 15.7696 2.40909 14.0824 1.53857 12.0004C1.90781 11.1171 2.38473 10.293 2.96935 9.52828C3.55397 8.76355 4.19756 8.10042 4.90012 7.53888L2.13087 4.73888L3.18472 3.68506L20.8154 21.3158L19.7616 22.3696ZM5.95395 8.59268C5.42575 9.0132 4.91197 9.51866 4.4126 10.1091C3.91323 10.6994 3.50906 11.3299 3.20007 12.0004C4.03341 13.6837 5.22924 15.0212 6.78757 16.0129C8.34591 17.0046 10.0834 17.5004 12.0001 17.5004C12.4552 17.5004 12.9084 17.4619 13.3597 17.385C13.811 17.3081 14.1937 17.2286 14.5078 17.1466L13.2424 15.8504C13.0719 15.9196 12.8744 15.9747 12.6501 16.0158C12.4257 16.0568 12.2091 16.0773 12.0001 16.0773C10.8655 16.0773 9.90234 15.6815 9.11067 14.8898C8.31901 14.0981 7.92317 13.135 7.92317 12.0004C7.92317 11.7978 7.94369 11.586 7.98472 11.3648C8.02576 11.1437 8.08088 10.9414 8.1501 10.7581L5.95395 8.59268Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconHide;
