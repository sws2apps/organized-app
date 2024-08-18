import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconNormalPin = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-normal-pin ${className}`}
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
          id="mask0_4944_2980599"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980599)">
          <path
            d="M12 16.7928C13.7333 15.4082 15.0416 14.0784 15.925 12.8034C16.8083 11.5284 17.25 10.3107 17.25 9.15046C17.25 8.17193 17.0712 7.33755 16.7135 6.64732C16.3558 5.9571 15.9125 5.39821 15.3836 4.97064C14.8548 4.54307 14.2851 4.23281 13.6746 4.03986C13.064 3.84691 12.5058 3.75044 12 3.75044C11.4941 3.75044 10.9359 3.84691 10.3254 4.03986C9.71484 4.23281 9.14515 4.54307 8.6163 4.97064C8.08745 5.39821 7.64418 5.9571 7.2865 6.64732C6.9288 7.33755 6.74995 8.17193 6.74995 9.15046C6.74995 10.3107 7.19162 11.5284 8.07495 12.8034C8.9583 14.0784 10.2666 15.4082 12 16.7928ZM12 18.6927C9.73331 17.0043 8.04165 15.369 6.925 13.787C5.80833 12.2049 5.25 10.6594 5.25 9.15031C5.25 8.0105 5.45448 7.01115 5.86345 6.15226C6.27243 5.29338 6.7985 4.57356 7.44165 3.99279C8.0848 3.41202 8.80834 2.97645 9.61228 2.68606C10.4162 2.39568 11.2121 2.25049 12 2.25049C12.7878 2.25049 13.5837 2.39568 14.3877 2.68606C15.1916 2.97645 15.9151 3.41202 16.5583 3.99279C17.2015 4.57356 17.7275 5.29338 18.1365 6.15226C18.5455 7.01115 18.75 8.0105 18.75 9.15031C18.75 10.6594 18.1916 12.2049 17.075 13.787C15.9583 15.369 14.2666 17.0043 12 18.6927ZM12 10.7504C12.4859 10.7504 12.899 10.5802 13.2394 10.2399C13.5798 9.8995 13.75 9.48636 13.75 9.00046C13.75 8.51456 13.5798 8.10143 13.2394 7.76106C12.899 7.42068 12.4859 7.25049 12 7.25049C11.5141 7.25049 11.1009 7.42068 10.7606 7.76106C10.4202 8.10143 10.25 8.51456 10.25 9.00046C10.25 9.48636 10.4202 9.8995 10.7606 10.2399C11.1009 10.5802 11.5141 10.7504 12 10.7504ZM5.25 21.7504V20.2505H18.75V21.7504H5.25Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconNormalPin;
