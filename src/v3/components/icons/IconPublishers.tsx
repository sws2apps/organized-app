import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconPublishers = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-publishers" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2673_23419"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2673_23419)">
          <path
            d="M0 17.4847V16.5428C0 15.8728 0.358036 15.3169 1.07411 14.8749C1.7902 14.433 2.71188 14.212 3.83915 14.212C4.00559 14.212 4.18392 14.22 4.37414 14.2361C4.56434 14.2522 4.76643 14.2784 4.98041 14.3148C4.80979 14.6127 4.68532 14.9183 4.60699 15.2316C4.52866 15.5449 4.4895 15.8588 4.4895 16.1735V17.4847H0ZM6.54545 17.4847V16.2575C6.54545 15.8178 6.67307 15.4159 6.92831 15.0518C7.18356 14.6877 7.56014 14.3728 8.05803 14.1071C8.55594 13.8414 9.13601 13.6421 9.79825 13.5092C10.4605 13.3763 11.1916 13.3099 11.9916 13.3099C12.807 13.3099 13.5458 13.3763 14.2081 13.5092C14.8703 13.6421 15.4504 13.8414 15.9482 14.1071C16.4462 14.3728 16.8217 14.6877 17.0748 15.0518C17.328 15.4159 17.4545 15.8178 17.4545 16.2575V17.4847H6.54545ZM19.5105 17.4847V16.1798C19.5105 15.8318 19.4724 15.5039 19.3961 15.1961C19.3199 14.8883 19.2056 14.5945 19.0531 14.3148C19.2811 14.2784 19.4857 14.2522 19.6668 14.2361C19.8479 14.22 20.0196 14.212 20.1818 14.212C21.3091 14.212 22.2273 14.4319 22.9364 14.8718C23.6455 15.3116 24 15.8686 24 16.5428V17.4847H19.5105ZM7.66784 16.3938H16.3385V16.163C16.2965 15.6456 15.8724 15.2225 15.0661 14.8938C14.2598 14.5651 13.2378 14.4008 12 14.4008C10.7622 14.4008 9.74021 14.5651 8.93392 14.8938C8.12763 15.2225 7.7056 15.6456 7.66784 16.163V16.3938ZM3.83359 13.184C3.40514 13.184 3.04021 13.032 2.73881 12.728C2.43741 12.424 2.28671 12.0585 2.28671 11.6316C2.28671 11.2092 2.43872 10.8484 2.74274 10.5491C3.04675 10.2498 3.41223 10.1001 3.83915 10.1001C4.26154 10.1001 4.62587 10.2498 4.93216 10.5491C5.23845 10.8484 5.3916 11.2113 5.3916 11.6378C5.3916 12.0518 5.24229 12.413 4.94367 12.7214C4.64505 13.0298 4.27503 13.184 3.83359 13.184ZM20.1818 13.184C19.7636 13.184 19.4003 13.0298 19.0919 12.7214C18.7836 12.413 18.6294 12.0518 18.6294 11.6378C18.6294 11.2113 18.7836 10.8484 19.0919 10.5491C19.4003 10.2498 19.765 10.1001 20.1859 10.1001C20.6195 10.1001 20.986 10.2498 21.2853 10.5491C21.5846 10.8484 21.7343 11.2092 21.7343 11.6316C21.7343 12.0585 21.5855 12.424 21.2879 12.728C20.9904 13.032 20.6217 13.184 20.1818 13.184ZM12.0074 12.4917C11.3451 12.4917 10.7797 12.2592 10.3112 11.7942C9.84265 11.3291 9.60837 10.7644 9.60837 10.1001C9.60837 9.42248 9.84089 8.85447 10.3059 8.39607C10.771 7.93769 11.3357 7.7085 12 7.7085C12.6776 7.7085 13.2456 7.93698 13.704 8.39394C14.1624 8.85092 14.3916 9.41718 14.3916 10.0927C14.3916 10.755 14.1631 11.3204 13.7062 11.7889C13.2492 12.2574 12.6829 12.4917 12.0074 12.4917ZM12.0105 11.4008C12.3685 11.4008 12.6731 11.2718 12.9241 11.0137C13.1752 10.7557 13.3007 10.4477 13.3007 10.0896C13.3007 9.73157 13.176 9.42702 12.9268 9.17599C12.6774 8.92493 12.3685 8.7994 12 8.7994C11.6489 8.7994 11.3444 8.92406 11.0864 9.17337C10.8283 9.42266 10.6993 9.73157 10.6993 10.1001C10.6993 10.4512 10.8283 10.7557 11.0864 11.0137C11.3444 11.2718 11.6524 11.4008 12.0105 11.4008Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPublishers;
