import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconDutiesDistribution = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
}: IconProps) => {
  return (
    <SvgIcon
      id="organized-icon-duties-distribution"
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
          id="mask0_3480_159317"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3480_159317)">
          <path
            d="M11.7883 19.9714C11.887 19.9714 11.9873 19.9484 12.0892 19.9022C12.1912 19.8561 12.2716 19.8035 12.3306 19.7445L20.3287 11.7464C20.5543 11.5208 20.7242 11.2798 20.8383 11.0234C20.9524 10.767 21.0094 10.4977 21.0094 10.2157C21.0094 9.92337 20.9524 9.64196 20.8383 9.37145C20.7242 9.10093 20.5543 8.85798 20.3287 8.6426L16.3287 4.64262C16.1133 4.41697 15.8799 4.25191 15.6287 4.14742C15.3774 4.04292 15.1056 3.99067 14.8133 3.99067C14.5312 3.99067 14.2604 4.04292 14.0008 4.14742C13.7411 4.25191 13.5017 4.41697 13.2825 4.64262L12.7094 5.2157L14.5594 7.0811C14.7838 7.2952 14.9495 7.53942 15.0565 7.81377C15.1636 8.08814 15.2171 8.37276 15.2171 8.66762C15.2171 9.27787 15.0132 9.78684 14.6056 10.1945C14.1979 10.6022 13.6889 10.806 13.0787 10.806C12.7838 10.806 12.4982 10.7573 12.2219 10.6599C11.9456 10.5625 11.7005 10.4067 11.4864 10.1926L9.59213 8.31375L5.24595 12.6599C5.17032 12.7355 5.11359 12.8202 5.07578 12.9137C5.03794 13.0073 5.01903 13.1035 5.01903 13.2022C5.01903 13.3868 5.08185 13.5445 5.2075 13.6753C5.33313 13.8061 5.48827 13.8715 5.6729 13.8715C5.77162 13.8715 5.87193 13.8484 5.97385 13.8022C6.07578 13.7561 6.15623 13.7035 6.2152 13.6445L9.49983 10.3599L10.5537 11.4137L7.28443 14.6983C7.20878 14.774 7.15204 14.8586 7.11423 14.9522C7.07639 15.0458 7.05748 15.142 7.05748 15.2407C7.05748 15.4189 7.1219 15.5724 7.25075 15.7013C7.3796 15.8301 7.53313 15.8945 7.71135 15.8945C7.81007 15.8945 7.91039 15.8715 8.01233 15.8253C8.11424 15.7791 8.19469 15.7266 8.25368 15.6676L11.6537 12.283L12.7075 13.3368L9.32288 16.7368C9.25364 16.7958 9.19851 16.8762 9.15748 16.9782C9.11646 17.0801 9.09595 17.1804 9.09595 17.2791C9.09595 17.4573 9.16038 17.6109 9.28923 17.7397C9.41806 17.8686 9.57158 17.933 9.7498 17.933C9.84852 17.933 9.94468 17.9141 10.0383 17.8763C10.1319 17.8384 10.2165 17.7817 10.2921 17.7061L13.6921 14.3214L14.746 15.3753L11.346 18.7753C11.2703 18.8509 11.2136 18.9387 11.1758 19.0387C11.1379 19.1387 11.119 19.2349 11.119 19.3272C11.119 19.5118 11.1876 19.6654 11.3248 19.7878C11.462 19.9102 11.6165 19.9714 11.7883 19.9714ZM11.7729 21.4714C11.2075 21.4714 10.7145 21.2753 10.294 20.8829C9.87353 20.4906 9.65366 20.0022 9.63443 19.4176C9.06776 19.3791 8.59437 19.1778 8.21425 18.8137C7.83412 18.4496 7.62803 17.9714 7.59598 17.3791C7.00368 17.3407 6.52483 17.1336 6.15945 16.758C5.79407 16.3823 5.59855 15.9099 5.5729 15.3407C4.97803 15.3022 4.48701 15.0865 4.09983 14.6936C3.71266 14.3006 3.51907 13.8035 3.51907 13.2022C3.51907 12.9074 3.57516 12.6186 3.68733 12.3359C3.79951 12.0532 3.96265 11.8048 4.17675 11.5907L9.59213 6.19072L12.5209 9.11955C12.5799 9.18878 12.6572 9.24391 12.7527 9.28495C12.8482 9.32596 12.9517 9.34647 13.0633 9.34647C13.2453 9.34647 13.4024 9.28622 13.5344 9.1657C13.6665 9.04518 13.7325 8.88749 13.7325 8.69262C13.7325 8.58107 13.712 8.47754 13.671 8.38202C13.6299 8.28652 13.5748 8.20928 13.5056 8.1503L9.99788 4.64262C9.78249 4.41697 9.54756 4.25191 9.29308 4.14742C9.03858 4.04292 8.76518 3.99067 8.47288 3.99067C8.19083 3.99067 7.92319 4.04292 7.66998 4.14742C7.41678 4.25191 7.17735 4.41697 6.9517 4.64262L3.66712 7.9426C3.48506 8.12465 3.33602 8.33971 3.22 8.5878C3.10397 8.83588 3.03569 9.08876 3.01517 9.34645C2.99468 9.55928 3.00429 9.76987 3.04402 9.9782C3.08377 10.1865 3.15365 10.3824 3.25365 10.5657L2.14982 11.6695C1.92419 11.3439 1.75432 10.9791 1.64022 10.5753C1.52611 10.1714 1.4793 9.76183 1.4998 9.34645C1.52032 8.8862 1.62417 8.44165 1.81135 8.0128C1.99852 7.58396 2.26069 7.20096 2.59787 6.86377L5.87288 3.5888C6.24723 3.2247 6.65459 2.95066 7.09498 2.76667C7.53536 2.58271 7.99785 2.49072 8.48245 2.49072C8.96707 2.49072 9.42797 2.58271 9.86515 2.76667C10.3023 2.95066 10.703 3.2247 11.0671 3.5888L11.6402 4.1619L12.2133 3.5888C12.5876 3.2247 12.9934 2.95066 13.4306 2.76667C13.8677 2.58271 14.3286 2.49072 14.8133 2.49072C15.2979 2.49072 15.7603 2.58271 16.2007 2.76667C16.6411 2.95066 17.0434 3.2247 17.4075 3.5888L21.3824 7.56377C21.7465 7.92787 22.0254 8.34229 22.219 8.80702C22.4126 9.27177 22.5094 9.74646 22.5094 10.2311C22.5094 10.7157 22.4126 11.1766 22.219 11.6137C22.0254 12.0509 21.7465 12.4516 21.3824 12.8157L13.3844 20.7983C13.1639 21.0188 12.9155 21.1862 12.6392 21.3003C12.3629 21.4144 12.0742 21.4714 11.7729 21.4714Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconDutiesDistribution;
