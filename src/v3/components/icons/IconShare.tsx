import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconShare = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-share" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2473_21945"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_21945)">
          <path
            d="M18.0011 21.7505C17.2375 21.7505 16.5881 21.4831 16.0529 20.9484C15.5176 20.4136 15.25 19.7643 15.25 19.0005C15.25 18.8756 15.2599 18.7463 15.2798 18.6126C15.2997 18.4789 15.3295 18.3556 15.3692 18.2428L7.97305 13.912C7.70895 14.1748 7.40831 14.3803 7.07113 14.5283C6.73394 14.6764 6.37689 14.7504 5.99997 14.7504C5.23609 14.7504 4.58679 14.4832 4.05207 13.9487C3.51736 13.4142 3.25 12.7652 3.25 12.0016C3.25 11.238 3.51736 10.5886 4.05207 10.0534C4.58679 9.51811 5.23609 9.25049 5.99997 9.25049C6.37689 9.25049 6.73394 9.32452 7.07113 9.47259C7.40831 9.62067 7.70895 9.82612 7.97305 10.0889L15.3692 5.75816C15.3295 5.64535 15.2997 5.52206 15.2798 5.38831C15.2599 5.25458 15.25 5.1253 15.25 5.00046C15.25 4.23658 15.5173 3.58728 16.0518 3.05256C16.5863 2.51785 17.2353 2.25049 17.9989 2.25049C18.7624 2.25049 19.4118 2.51774 19.9471 3.05224C20.4823 3.58674 20.75 4.23577 20.75 4.99934C20.75 5.76291 20.4826 6.41231 19.9479 6.94756C19.4132 7.48281 18.7639 7.75044 18 7.75044C17.6231 7.75044 17.266 7.67641 16.9288 7.52834C16.5916 7.38026 16.291 7.17481 16.0269 6.91199L8.63073 11.2428C8.67048 11.3556 8.70028 11.4786 8.72015 11.6119C8.74002 11.7452 8.74995 11.8741 8.74995 11.9985C8.74995 12.1229 8.74002 12.2524 8.72015 12.387C8.70028 12.5216 8.67048 12.6453 8.63073 12.7582L16.0269 17.0889C16.291 16.8261 16.5916 16.6207 16.9288 16.4726C17.266 16.3245 17.6231 16.2505 18 16.2505C18.7639 16.2505 19.4132 16.5177 19.9479 17.0522C20.4826 17.5867 20.75 18.2358 20.75 18.9993C20.75 19.7629 20.4827 20.4123 19.9482 20.9476C19.4137 21.4828 18.7647 21.7505 18.0011 21.7505ZM18 6.25046C18.3474 6.25046 18.6426 6.12899 18.8856 5.88604C19.1285 5.64307 19.25 5.34787 19.25 5.00044C19.25 4.65301 19.1285 4.35781 18.8856 4.11484C18.6426 3.87191 18.3474 3.75044 18 3.75044C17.6525 3.75044 17.3573 3.87191 17.1144 4.11486C16.8714 4.35783 16.75 4.65303 16.75 5.00046C16.75 5.3479 16.8714 5.6431 17.1144 5.88606C17.3573 6.12901 17.6525 6.25046 18 6.25046ZM5.99997 13.2505C6.34741 13.2505 6.64261 13.129 6.88558 12.886C7.12853 12.6431 7.25 12.3479 7.25 12.0004C7.25 11.653 7.12853 11.3578 6.88558 11.1148C6.64261 10.8719 6.34741 10.7504 5.99997 10.7504C5.65254 10.7504 5.35734 10.8719 5.11438 11.1149C4.87143 11.3578 4.74995 11.653 4.74995 12.0005C4.74995 12.3479 4.87143 12.6431 5.11438 12.8861C5.35734 13.129 5.65254 13.2505 5.99997 13.2505ZM18 20.2505C18.3474 20.2505 18.6426 20.129 18.8856 19.886C19.1285 19.6431 19.25 19.3479 19.25 19.0004C19.25 18.653 19.1285 18.3578 18.8856 18.1148C18.6426 17.8719 18.3474 17.7504 18 17.7504C17.6525 17.7504 17.3573 17.8719 17.1144 18.1149C16.8714 18.3578 16.75 18.653 16.75 19.0005C16.75 19.3479 16.8714 19.6431 17.1144 19.8861C17.3573 20.129 17.6525 20.2505 18 20.2505Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconShare;
