import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconLogo = ({
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-logo ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="154"
        height="154"
        viewBox="0 0 154 154"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_4686_167575)">
          <rect
            x="21.5804"
            y="21.4773"
            width="110.839"
            height="111.045"
            fill="#FEFEFE"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M129.045 51.8058L77.8952 51.8058C63.5894 51.8058 51.9923 40.2087 51.9923 25.9029C51.9923 11.5972 63.5894 8.63075e-05 77.8952 8.7738e-05L114.088 9.05991e-05V-4.2063C121.324 -4.2063 127.502 -2.6292 132.681 9.20296e-05L154 9.39369e-05L154 33.676C154.045 34.4181 154.068 35.1505 154.068 35.8711V78.2791C154.068 64.1363 142.995 52.5796 129.045 51.8058Z"
            fill="url(#paint0_linear_4686_167575)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M49.162 -3.18042H-3.20837V40.9101H-0.0266476L-0.026649 75.9903C-0.0266495 90.3855 11.643 102.055 26.0382 102.055C40.4334 102.055 52.1031 90.3856 52.1031 75.9903L52.1031 26.2264C52.1704 11.6403 64.0155 -0.163198 78.6174 -0.163199L49.162 -0.163197V-3.18042Z"
            fill="url(#paint1_linear_4686_167575)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25.0017 101.86L75.9989 101.86C90.3971 101.86 102.069 113.532 102.069 127.93C102.069 142.328 90.397 154 75.9989 154L1.21836e-05 154L1.87866e-05 115.682C-0.0177562 115.228 -0.026611 114.777 -0.0266109 114.331L-0.0266113 75.3922C-0.0233847 89.5342 11.0515 101.089 25.0017 101.86Z"
            fill="url(#paint2_linear_4686_167575)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M119.085 154L154 154V130.797C156.025 126.099 157.209 120.645 157.209 114.393H154V77.7485C154 63.361 142.337 51.6975 127.949 51.6975C113.561 51.6975 101.898 63.3609 101.898 77.7485L101.898 114.393H101.898V127.517C101.898 142.16 90.0267 154.031 75.3831 154.031H117.604C118.092 154.031 118.586 154.021 119.085 154Z"
            fill="url(#paint3_linear_4686_167575)"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_4686_167575"
            x1="59.511"
            y1="19.1622"
            x2="127.71"
            y2="77.7339"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#EEAF35" />
            <stop offset="1" stopColor="#FBC93C" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_4686_167575"
            x1="50.2641"
            y1="3.92229"
            x2="27.2586"
            y2="103.399"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AC6CBB" />
            <stop offset="1" stopColor="#7D5FBD" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_4686_167575"
            x1="-3.20822"
            y1="72.7795"
            x2="84.7381"
            y2="160.433"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0ABBE5" />
            <stop offset="1" stopColor="#3B98CC" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_4686_167575"
            x1="130.472"
            y1="50.0767"
            x2="98.5954"
            y2="156.707"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5C9B1C" />
            <stop offset="1" stopColor="#50B600" />
          </linearGradient>
          <clipPath id="clip0_4686_167575">
            <rect width="154" height="154" rx="44" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
};

export default IconLogo;
