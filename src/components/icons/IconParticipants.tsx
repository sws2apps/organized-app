import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconParticipants = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-participants ${className}`}
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
          id="mask0_2513_2654"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2513_2654)">
          <path
            d="M17 15.8178C16.2628 15.8178 15.6362 15.5598 15.1202 15.0437C14.6042 14.5277 14.3461 13.9011 14.3461 13.1639C14.3461 12.4268 14.6042 11.8002 15.1202 11.2841C15.6362 10.7681 16.2628 10.5101 17 10.5101C17.7371 10.5101 18.3637 10.7681 18.8798 11.2841C19.3958 11.8002 19.6538 12.4268 19.6538 13.1639C19.6538 13.9011 19.3958 14.5277 18.8798 15.0437C18.3637 15.5598 17.7371 15.8178 17 15.8178ZM17 14.3178C17.3218 14.3178 17.5945 14.2059 17.8182 13.9822C18.042 13.7585 18.1538 13.4857 18.1538 13.1639C18.1538 12.8421 18.042 12.5694 17.8182 12.3457C17.5945 12.1219 17.3218 12.0101 17 12.0101C16.6782 12.0101 16.4054 12.1219 16.1817 12.3457C15.958 12.5694 15.8461 12.8421 15.8461 13.1639C15.8461 13.4857 15.958 13.7585 16.1817 13.9822C16.4054 14.2059 16.6782 14.3178 17 14.3178ZM11.3461 22.2696V19.7158C11.3461 19.4263 11.4151 19.154 11.5531 18.899C11.6911 18.6439 11.8843 18.4406 12.1327 18.2889C12.6308 17.9917 13.1562 17.7454 13.7089 17.5499C14.2616 17.3544 14.8259 17.2097 15.4019 17.1158L17 19.1255L18.5884 17.1158C19.1676 17.2097 19.731 17.3544 20.2789 17.5499C20.8267 17.7454 21.351 17.9917 21.8519 18.2889C22.1006 18.4402 22.2948 18.6428 22.4346 18.8966C22.5743 19.1504 22.6474 19.4203 22.6538 19.7062V22.2696H11.3461ZM12.8211 20.7697H16.3866L14.8346 18.7927C14.4814 18.8822 14.1379 18.9984 13.8043 19.1415C13.4706 19.2846 13.1429 19.444 12.8211 19.6197V20.7697ZM17.6134 20.7697H21.1538V19.6197C20.8423 19.4338 20.5197 19.2735 20.1861 19.1389C19.8524 19.0043 19.509 18.8921 19.1557 18.8023L17.6134 20.7697ZM5.31227 20.5004C4.81051 20.5004 4.38302 20.3234 4.02982 19.9694C3.67661 19.6154 3.5 19.1899 3.5 18.6927V5.30819C3.5 4.81107 3.67701 4.38551 4.03102 4.03151C4.38502 3.6775 4.81058 3.50049 5.3077 3.50049H18.6922C19.1894 3.50049 19.6149 3.6775 19.9689 4.03151C20.3229 4.38551 20.5 4.81107 20.5 5.30819V9.65429C20.291 9.41711 20.0682 9.195 19.8317 8.98796C19.5951 8.78091 19.3179 8.63701 19 8.55624V5.30819C19 5.21844 18.9711 5.14471 18.9134 5.08701C18.8557 5.02931 18.782 5.00046 18.6922 5.00046H5.3077C5.21795 5.00046 5.14423 5.02931 5.08652 5.08701C5.02882 5.14471 4.99997 5.21844 4.99997 5.30819V18.6927C4.99997 18.7825 5.02882 18.8562 5.08652 18.9139C5.14423 18.9716 5.21795 19.0005 5.3077 19.0005H9.05382C9.02304 19.1197 8.99996 19.2389 8.98457 19.3581C8.96919 19.4774 8.9615 19.5966 8.9615 19.7158V20.5004H5.31227ZM7.25 8.86584H14.4616C14.7987 8.62867 15.1631 8.4524 15.5548 8.33701C15.9465 8.22163 16.3448 8.15753 16.75 8.14471V7.36586H7.25V8.86584ZM7.25 12.7504H12.0096C12.0224 12.4838 12.0583 12.2271 12.1173 11.9803C12.1763 11.7335 12.2532 11.4902 12.3481 11.2505H7.25V12.7504ZM7.25 16.6351H10.3731C10.55 16.4915 10.7362 16.3597 10.9317 16.2399C11.1272 16.12 11.3269 16.0133 11.5307 15.9197V15.1351H7.25V16.6351ZM4.99997 19.0005V5.00046V8.54086V8.12546V19.0005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconParticipants;
