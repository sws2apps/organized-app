import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconSharedWith = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-shared-with"
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_2621_40947"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2621_40947)">
          <path
            d="M16 21.5004V19.3177C15.1179 19.0626 14.3666 18.5934 13.7461 17.9101C13.1256 17.2267 12.7461 16.4235 12.6077 15.5005H14.1076C14.2858 16.2235 14.6602 16.821 15.2307 17.2928C15.8012 17.7646 16.4743 18.0005 17.25 18.0005H20.25C20.5961 18.0005 20.891 18.1223 21.1346 18.3658C21.3782 18.6094 21.5 18.9043 21.5 19.2504V21.5004H16ZM18.75 16.5004C18.2641 16.5004 17.8509 16.3302 17.5106 15.9899C17.1702 15.6495 17 15.2363 17 14.7504C17 14.2646 17.1702 13.8514 17.5106 13.511C17.8509 13.1707 18.2641 13.0005 18.75 13.0005C19.2359 13.0005 19.649 13.1707 19.9894 13.511C20.3298 13.8514 20.5 14.2646 20.5 14.7504C20.5 15.2363 20.3298 15.6495 19.9894 15.9899C19.649 16.3302 19.2359 16.5004 18.75 16.5004ZM9.38462 13.7504C9.38462 11.5325 10.1603 9.64953 11.7115 8.10146C13.2628 6.5534 15.1474 5.77936 17.3653 5.77936V7.27934C15.5628 7.27934 14.032 7.90721 12.773 9.16296C11.5141 10.4187 10.8846 11.9479 10.8846 13.7504H9.38462ZM12.8846 13.7504C12.8846 12.5081 13.3208 11.4508 14.1932 10.5784C15.0657 9.70593 16.123 9.26971 17.3653 9.26971V10.7697C16.5384 10.7697 15.8349 11.0597 15.2547 11.6399C14.6746 12.22 14.3846 12.9235 14.3846 13.7504H12.8846ZM2.5 11.0005V8.75049C2.5 8.40434 2.6218 8.10947 2.8654 7.86589C3.10898 7.62229 3.40385 7.50049 3.75 7.50049H6.75C7.52563 7.50049 8.19871 7.2646 8.76923 6.79281C9.33974 6.32101 9.71411 5.72357 9.89233 5.00049H11.4019C11.2762 5.91074 10.9016 6.71074 10.2779 7.40049C9.65413 8.09022 8.89484 8.56266 7.99998 8.81779V11.0005H2.5ZM5.25 6.00046C4.7641 6.00046 4.35096 5.83027 4.01058 5.48989C3.67019 5.14951 3.5 4.73637 3.5 4.25049C3.5 3.76459 3.67019 3.35145 4.01058 3.01106C4.35096 2.67068 4.7641 2.50049 5.25 2.50049C5.73588 2.50049 6.14902 2.67068 6.4894 3.01106C6.82978 3.35145 6.99998 3.76459 6.99998 4.25049C6.99998 4.73637 6.82978 5.14951 6.4894 5.48989C6.14902 5.83027 5.73588 6.00046 5.25 6.00046Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconSharedWith;
