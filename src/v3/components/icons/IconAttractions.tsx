import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconAttractions = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-attractions" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2980564"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980564)">
          <path
            d="M6.20007 21.6349L7.45392 18.8157C7.19494 18.6259 6.9459 18.434 6.7068 18.2397C6.4677 18.0455 6.23853 17.8323 6.0193 17.6003C5.89878 17.6503 5.77762 17.6878 5.65582 17.7128C5.53404 17.7378 5.40776 17.7503 5.277 17.7503C4.76545 17.7503 4.32666 17.5673 3.96065 17.2013C3.59463 16.8352 3.41162 16.3965 3.41162 15.8849C3.41162 15.5836 3.47765 15.3035 3.6097 15.0445C3.74175 14.7856 3.92315 14.5708 4.15392 14.4003C4.02059 14.017 3.92571 13.6295 3.8693 13.2378C3.81288 12.8462 3.78467 12.4337 3.78467 12.0003C3.78467 11.567 3.81288 11.1545 3.8693 10.7628C3.92571 10.3712 4.02059 9.98366 4.15392 9.60032C3.92315 9.42981 3.74175 9.21506 3.6097 8.9561C3.47765 8.69713 3.41162 8.41701 3.41162 8.11572C3.41162 7.60419 3.59463 7.1654 3.96065 6.79937C4.32666 6.43335 4.76545 6.25035 5.277 6.25035C5.40776 6.25035 5.53404 6.26285 5.65582 6.28785C5.77762 6.31285 5.89878 6.35035 6.0193 6.40035C6.5693 5.80035 7.19525 5.29874 7.89717 4.89552C8.59909 4.49232 9.35005 4.19393 10.15 4.00035C10.2206 3.53881 10.4337 3.151 10.7895 2.8369C11.1452 2.52278 11.5539 2.36572 12.0154 2.36572C12.477 2.36572 12.8856 2.52214 13.2414 2.83497C13.5972 3.14779 13.8103 3.52983 13.8808 3.9811C14.6936 4.1747 15.451 4.47053 16.1529 4.8686C16.8548 5.26668 17.4808 5.7606 18.0308 6.35035C18.1513 6.30035 18.2667 6.26605 18.3769 6.24745C18.4872 6.22886 18.6026 6.21957 18.7231 6.21957C19.2346 6.21957 19.6734 6.40258 20.0394 6.7686C20.4055 7.13463 20.5885 7.57341 20.5885 8.08495C20.5885 8.38623 20.525 8.66123 20.3981 8.90995C20.2712 9.15866 20.0975 9.36828 19.8769 9.5388C20.0103 9.93238 20.1052 10.3327 20.1616 10.7397C20.218 11.1468 20.2462 11.567 20.2462 12.0003C20.2462 12.4337 20.218 12.8545 20.1616 13.2628C20.1052 13.6712 20.0103 14.067 19.8769 14.4503C20.091 14.6208 20.26 14.8272 20.3837 15.0695C20.5074 15.3118 20.5692 15.5836 20.5692 15.8849C20.5692 16.3965 20.3862 16.8352 20.0202 17.2013C19.6542 17.5673 19.2154 17.7503 18.7039 17.7503C18.5834 17.7503 18.468 17.7394 18.3577 17.7176C18.2475 17.6958 18.1321 17.6631 18.0116 17.6195C17.7923 17.8516 17.5689 18.0699 17.3414 18.2743C17.1138 18.4788 16.859 18.6759 16.5769 18.8657L17.7808 21.6349H16.3539L15.4231 19.4926C15.1642 19.6118 14.9103 19.7138 14.6616 19.7984C14.4129 19.883 14.1526 19.9567 13.8808 20.0195C13.8103 20.4708 13.5972 20.8529 13.2414 21.1657C12.8856 21.4785 12.477 21.6349 12.0154 21.6349C11.5539 21.6349 11.1452 21.4779 10.7895 21.1637C10.4337 20.8496 10.2206 20.4618 10.15 20.0003C9.868 19.9375 9.60005 19.8638 9.3462 19.7791C9.09235 19.6945 8.83594 19.5926 8.57697 19.4734L7.62697 21.6349L6.20007 21.6349ZM7.88852 17.7657L9.65007 13.8234C9.44879 13.5683 9.2927 13.2862 9.18182 12.9772C9.07092 12.6683 9.01547 12.3426 9.01547 12.0003C9.01547 11.185 9.31162 10.4811 9.90392 9.8888C10.4962 9.2965 11.2001 9.00035 12.0154 9.00035C12.8308 9.00035 13.5346 9.2965 14.1269 9.8888C14.7192 10.4811 15.0154 11.185 15.0154 12.0003C15.0154 12.3426 14.9542 12.675 14.8317 12.9974C14.7093 13.3199 14.5423 13.6118 14.3308 13.8734L16.0923 17.7849C16.2808 17.6452 16.4619 17.5051 16.6356 17.3647C16.8093 17.2244 16.9757 17.0631 17.1347 16.8811C17.0257 16.7413 16.9491 16.5859 16.9048 16.4147C16.8606 16.2436 16.8385 16.067 16.8385 15.8849C16.8385 15.3516 17.0363 14.9013 17.4318 14.534C17.8273 14.1667 18.2821 14.0016 18.7962 14.0388C18.8962 13.7055 18.9744 13.3731 19.0308 13.0417C19.0872 12.7103 19.1154 12.3631 19.1154 12.0003C19.1154 11.6375 19.0872 11.2853 19.0308 10.9436C18.9744 10.6019 18.8962 10.2644 18.7962 9.9311C18.2821 9.96828 17.8305 9.80321 17.4414 9.4359C17.0523 9.0686 16.8577 8.61828 16.8577 8.08495C16.8577 7.91571 16.8866 7.75065 16.9443 7.58975C17.002 7.42885 17.0718 7.27853 17.1539 7.1388C16.6706 6.63623 16.1324 6.21667 15.5395 5.88012C14.9465 5.54359 14.3154 5.28366 13.6462 5.10032C13.4949 5.40289 13.276 5.64456 12.9895 5.82532C12.7029 6.00609 12.3783 6.09647 12.0154 6.09647C11.6526 6.09647 11.3279 6.00609 11.0414 5.82532C10.7548 5.64456 10.5359 5.40289 10.3847 5.10032C9.69492 5.28366 9.05357 5.54616 8.46062 5.88782C7.86767 6.22949 7.32953 6.65673 6.8462 7.16955C6.92825 7.3093 6.99812 7.45962 7.05582 7.62052C7.11352 7.78142 7.14237 7.94649 7.14237 8.11572C7.14237 8.65546 6.94974 9.10321 6.56447 9.45897C6.1792 9.81476 5.72952 9.98238 5.21542 9.96185C5.11542 10.2952 5.04042 10.6276 4.99042 10.959C4.94042 11.2904 4.91542 11.6375 4.91542 12.0003C4.91542 12.3631 4.94042 12.7103 4.99042 13.0417C5.04042 13.3731 5.11542 13.7055 5.21542 14.0388C5.7167 14.0016 6.16318 14.1651 6.55485 14.5292C6.94653 14.8933 7.14237 15.3452 7.14237 15.8849C7.14237 16.067 7.12025 16.2352 7.07602 16.3897C7.03179 16.5442 6.95518 16.6913 6.8462 16.8311C7.00518 17.0131 7.17153 17.1763 7.34525 17.3205C7.51896 17.4648 7.70005 17.6132 7.88852 17.7657ZM9.04235 18.4234C9.25131 18.526 9.46766 18.6154 9.6914 18.6917C9.91511 18.768 10.1462 18.8375 10.3847 18.9003C10.5359 18.5978 10.7548 18.3561 11.0414 18.1753C11.3279 17.9946 11.6526 17.9042 12.0154 17.9042C12.3783 17.9042 12.7029 17.9946 12.9895 18.1753C13.276 18.3561 13.4949 18.5978 13.6462 18.9003C13.8782 18.8375 14.0994 18.7712 14.3097 18.7013C14.5199 18.6314 14.7295 18.5452 14.9385 18.4426L13.277 14.7118C13.0834 14.8016 12.883 14.8721 12.676 14.9234C12.4689 14.9747 12.2488 15.0003 12.0154 15.0003C11.7718 15.0003 11.5408 14.9721 11.3222 14.9157C11.1036 14.8593 10.8975 14.7746 10.7039 14.6618L9.04235 18.4234ZM12.0154 13.5003C12.4154 13.5003 12.7654 13.3587 13.0654 13.0753C13.3654 12.792 13.5154 12.4337 13.5154 12.0003C13.5154 11.6003 13.3654 11.2503 13.0654 10.9503C12.7654 10.6503 12.4154 10.5003 12.0154 10.5003C11.5821 10.5003 11.2238 10.6503 10.9404 10.9503C10.6571 11.2503 10.5154 11.6003 10.5154 12.0003C10.5154 12.4337 10.6571 12.792 10.9404 13.0753C11.2238 13.3587 11.5821 13.5003 12.0154 13.5003Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconAttractions;
