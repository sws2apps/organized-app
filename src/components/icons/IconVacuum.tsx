import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconVacuum = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-vacuum ${className}`}
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
          id="mask0_13161_343514"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_13161_343514)">
          <path
            d="M4.00125 21.75C3.23758 21.75 2.58817 21.4827 2.053 20.9482C1.51767 20.4137 1.25 19.7647 1.25 19.0012C1.25 18.2376 1.51725 17.5882 2.05175 17.053C2.58625 16.5177 3.23525 16.25 3.99875 16.25C4.76242 16.25 5.41183 16.5173 5.947 17.0518C6.48233 17.5863 6.75 18.2353 6.75 18.9988C6.75 19.7624 6.48275 20.4118 5.94825 20.947C5.41375 21.4823 4.76475 21.75 4.00125 21.75ZM4 20.25C4.3475 20.25 4.64267 20.1285 4.8855 19.8855C5.1285 19.6427 5.25 19.3475 5.25 19C5.25 18.6525 5.1285 18.3573 4.8855 18.1145C4.64267 17.8715 4.3475 17.75 4 17.75C3.6525 17.75 3.35733 17.8715 3.1145 18.1145C2.8715 18.3573 2.75 18.6525 2.75 19C2.75 19.3475 2.8715 19.6427 3.1145 19.8855C3.35733 20.1285 3.6525 20.25 4 20.25ZM7.875 21.75C8.05067 21.5142 8.19167 21.2754 8.298 21.0338C8.4045 20.7921 8.493 20.5308 8.5635 20.25H10.8652V13C10.8652 12.3812 10.645 11.8515 10.2045 11.411C9.76383 10.9703 9.23408 10.75 8.61525 10.75H3.75V14.2693C3.49617 14.2756 3.2385 14.3041 2.977 14.3548C2.7155 14.4054 2.47317 14.4782 2.25 14.573V9.25H5.25V5.6C5.25 4.3865 5.67158 3.35808 6.51475 2.51475C7.35775 1.67158 8.38592 1.25 9.59925 1.25C10.4817 1.25 11.2855 1.48975 12.0105 1.96925C12.7355 2.44875 13.2685 3.09108 13.6095 3.89625L20.5115 20.25H22.75V21.75H16.25V20.25H18.8848L12.2463 4.50375C12.0206 3.96925 11.6693 3.54333 11.1923 3.226C10.7154 2.90867 10.186 2.75 9.604 2.75C8.80383 2.75 8.12817 3.02567 7.577 3.577C7.02567 4.12817 6.75 4.8025 6.75 5.6V9.25H8.61525C9.65125 9.25 10.5352 9.616 11.2673 10.348C11.9993 11.0802 12.3652 11.9642 12.3652 13V21.75H7.875Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconVacuum;
