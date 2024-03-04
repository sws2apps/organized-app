import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconRaiseHand = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-raise-hand" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_5189_226351"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5189_226351)">
          <path
            d="M5.50023 21.0004V15.6543C4.93741 14.6325 4.5076 13.6046 4.2108 12.5706C3.91402 11.5367 3.76562 10.5203 3.76562 9.52161C3.76562 8.62035 3.88037 7.7117 4.10985 6.79566C4.33933 5.87965 4.6451 4.90497 5.02715 3.87164C5.12202 3.61139 5.27778 3.40114 5.49445 3.24089C5.71112 3.08062 5.95791 3.00049 6.23483 3.00049C6.60404 3.00049 6.91749 3.13222 7.17517 3.39569C7.43286 3.65914 7.53798 3.96842 7.49055 4.32354L7.22518 6.49276C7.12518 7.33123 7.21363 8.14085 7.49055 8.92161C7.76748 9.7024 8.17486 10.3941 8.71268 10.9966C9.25051 11.5992 9.88993 12.0838 10.631 12.4505C11.372 12.8172 12.1617 13.0005 13.0002 13.0005C14.0194 13.0005 14.9932 13.0886 15.9214 13.2649C16.8496 13.4412 17.6502 13.6954 18.3233 14.0274C19.0156 14.3723 19.5514 14.8133 19.9309 15.3505C20.3104 15.8877 20.5002 16.5543 20.5002 17.3505V21.0004H5.50023ZM7.0002 19.5005H19.0002V17.3505C19.0002 16.9184 18.8906 16.5386 18.6714 16.211C18.4521 15.8835 18.1335 15.6184 17.7156 15.4158C17.1028 15.121 16.3752 14.8947 15.5329 14.737C14.6906 14.5793 13.8464 14.5005 13.0002 14.5005C11.9387 14.5005 10.9403 14.2691 10.005 13.8062C9.06976 13.3434 8.26655 12.7296 7.5954 11.9649C6.92425 11.2001 6.4172 10.3251 6.07425 9.33989C5.7313 8.35462 5.62328 7.34148 5.7502 6.30046C5.58353 6.80046 5.4627 7.32739 5.3877 7.88124C5.3127 8.43507 5.2752 8.98186 5.2752 9.52161C5.2752 10.4306 5.43482 11.3533 5.75405 12.2899C6.07327 13.2264 6.48865 14.2094 7.0002 15.2389V19.5005ZM13.0002 11.7697C12.0348 11.7697 11.2102 11.4277 10.5262 10.7438C9.84221 10.0598 9.50023 9.23512 9.50023 8.26974C9.50023 7.30437 9.84221 6.47971 10.5262 5.79574C11.2102 5.11177 12.0348 4.76979 13.0002 4.76979C13.9656 4.76979 14.7902 5.11177 15.4742 5.79574C16.1582 6.47971 16.5002 7.30437 16.5002 8.26974C16.5002 9.23512 16.1582 10.0598 15.4742 10.7438C14.7902 11.4277 13.9656 11.7697 13.0002 11.7697ZM13.0002 10.2697C13.5502 10.2697 14.021 10.0739 14.4127 9.68224C14.8044 9.29057 15.0002 8.81974 15.0002 8.26974C15.0002 7.71974 14.8044 7.24891 14.4127 6.85724C14.021 6.46557 13.5502 6.26974 13.0002 6.26974C12.4502 6.26974 11.9794 6.46557 11.5877 6.85724C11.196 7.24891 11.0002 7.71974 11.0002 8.26974C11.0002 8.81974 11.196 9.29057 11.5877 9.68224C11.9794 10.0739 12.4502 10.2697 13.0002 10.2697ZM9.26945 21.0004V20.3351C9.26945 19.3081 9.6281 18.4315 10.3454 17.7053C11.0627 16.979 11.9348 16.6159 12.9617 16.6159H16.654V18.1158H12.9617C12.3438 18.1158 11.8239 18.3328 11.4021 18.7668C10.9803 19.2008 10.7694 19.7235 10.7694 20.3351V21.0004H9.26945Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRaiseHand;
