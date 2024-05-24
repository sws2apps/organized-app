import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconLiving = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-living" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.7426 4.67337C25.9374 4.40705 25.0678 4.40705 24.2626 4.67337L23.9263 4.7846C23.6234 4.88477 23.3312 5.01476 23.054 5.17265L18.3339 7.86122H7.76252C7.07444 7.86122 6.39568 8.02033 5.77929 8.32613L4.8533 8.78552C3.9374 9.2399 3.20531 9.995 2.77948 10.9245L2.70637 11.0841C2.4392 11.6673 2.30091 12.3012 2.30091 12.9427V16.4078C2.30091 17.1086 3.08065 17.5277 3.66511 17.1411L4.62867 16.5037V17.7849L1.47248 19.6469C1.2045 19.805 1.04004 20.093 1.04004 20.4041V27.8214C1.04004 28.3069 1.43365 28.7005 1.91921 28.7005H3.24986C3.65127 28.7005 4.00171 28.4287 4.10145 28.0399L5.23007 23.6405L8.0298 28.2759C8.18899 28.5395 8.47445 28.7005 8.78235 28.7005H10.4734C11.0981 28.7005 11.5235 28.0672 11.2872 27.4889L8.93712 21.7358C8.88158 21.5999 8.78818 21.4908 8.67407 21.4158L9.08473 21.1979L13.7073 21.2934L13.0632 27.7339C13.0115 28.2515 13.4179 28.7006 13.938 28.7006H15.6086C15.9926 28.7006 16.3321 28.4513 16.4473 28.085L18.0698 22.9225L19.3582 28.0362C19.4567 28.4268 19.808 28.7005 20.2108 28.7005H21.8153C22.3313 28.7005 22.7364 28.2582 22.691 27.7441L22.0611 20.6007L23.1161 19.7034C23.2045 19.6283 23.2771 19.5364 23.3298 19.433L27.2893 11.6671H28.518C29.0187 11.6671 29.4962 11.4555 29.8327 11.0846L30.4528 10.4009C31.1551 9.62674 31.1238 8.43702 30.3818 7.70082L28.284 5.61936C27.8503 5.18903 27.3226 4.86522 26.7426 4.67337ZM17.0956 21.3635L15.1114 21.3225L14.5135 27.3006H15.2263L17.0723 21.427C17.0791 21.4053 17.0869 21.3841 17.0956 21.3635ZM7.58898 21.9917L6.28062 22.6861C6.30185 22.7119 6.32147 22.7396 6.33927 22.7691L9.07624 27.3005H9.69798L7.64108 22.2653C7.60447 22.1756 7.58779 22.0828 7.58898 21.9917ZM24.7022 6.00256C25.2219 5.83066 25.7832 5.83066 26.303 6.00256C26.6774 6.12639 27.018 6.33541 27.2979 6.61317L29.3957 8.69464C29.6061 8.90341 29.615 9.24079 29.4159 9.46034L28.7957 10.144C28.7246 10.2224 28.6238 10.2671 28.518 10.2671H26.4316L22.1298 18.7044L20.949 19.7086C20.7319 19.8932 20.6178 20.1716 20.6429 20.4555L21.2465 27.3005H20.6166L18.9405 20.6482C18.8437 20.2642 18.5021 19.9922 18.1062 19.9841L8.97832 19.7954C8.8285 19.7923 8.68038 19.8275 8.54801 19.8978L4.48847 22.0522C4.27001 22.1682 4.11048 22.3708 4.04902 22.6104L2.84578 27.3005H2.44004V20.7016L5.59623 18.8395C5.86421 18.6814 6.02867 18.3935 6.02867 18.0823V15.5347C6.02867 14.834 5.24893 14.4148 4.66447 14.8015L3.70091 15.4388V12.9427C3.70091 12.5025 3.79582 12.0674 3.97917 11.6672L4.05228 11.5076C4.34451 10.8697 4.84693 10.3515 5.47548 10.0397L6.40148 9.58027C6.82449 9.37041 7.29031 9.26122 7.76252 9.26122H18.7047L23.7469 6.38915C23.9436 6.27711 24.151 6.18487 24.3659 6.11379L24.7022 6.00256ZM24.5709 8.20329C24.8469 7.9359 24.8558 7.49539 24.5899 7.21703C24.3229 6.93748 23.8798 6.92734 23.6002 7.19438L24.0838 7.70055C23.6002 7.19438 23.6 7.19463 23.5997 7.19489L23.5991 7.19545L23.5979 7.19667L23.5948 7.19959L23.587 7.20727C23.581 7.2132 23.5735 7.22077 23.5645 7.22991C23.5467 7.24818 23.5233 7.27288 23.4957 7.30357C23.4407 7.3647 23.368 7.45103 23.2894 7.55906C23.1353 7.77095 22.943 8.08808 22.8316 8.47945C22.7179 8.87855 22.6866 9.36472 22.8758 9.87827C23.0643 10.3897 23.4463 10.8598 24.0389 11.2742C24.3557 11.4958 24.7922 11.4185 25.0137 11.1017C25.2353 10.7849 25.158 10.3484 24.8412 10.1269C24.4243 9.8354 24.2571 9.57763 24.1895 9.39415C24.1226 9.21285 24.1284 9.03726 24.178 8.86283C24.2299 8.68067 24.3271 8.5125 24.4216 8.38248C24.4674 8.31956 24.5087 8.27078 24.5368 8.23953C24.5508 8.22404 24.5611 8.21324 24.5666 8.20755L24.5709 8.20329Z"
          fill={color}
        />
      </svg>
    </SvgIcon>
  );
};

export default IconLiving;
