import { Path, Svg, Ellipse } from '@react-pdf/renderer';
import { IconProps } from './index.types';

const IconCart = ({ size = 24, color = '#222222' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        d="M8.93961 0.419434H17.3821L14.5923 21.4325H13.7167L13.5189 22.8929C13.4547 23.2879 13.0709 23.5813 12.6182 23.5813H7.49166C6.94388 23.5813 6.5203 23.1577 6.58902 22.6787L6.71984 21.3887H6.09913L8.93961 0.419434ZM7.94538 19.9889H8.57171L8.31735 22.1376H11.9871L12.2966 19.9889H13.1407L15.5345 1.8631H10.3876L7.94538 19.9889Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        d="M13.0066 13.1265L12.6977 15.2998L11.1689 15.3L11.4982 13.1266L13.0066 13.1265Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        d="M13.5784 8.83398L13.2695 11.0073L11.7407 11.0075L12.07 8.83414L13.5784 8.83398Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        d="M12.3787 17.8076L12.0698 19.981L10.541 19.9811L10.8703 17.8078L12.3787 17.8076Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        d="M10.946 13.1265L10.6372 15.2998L9.1084 15.3L9.43765 13.1266L10.946 13.1265Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        d="M11.5061 8.83398L11.1972 11.0073L9.66846 11.0075L9.99771 8.83414L11.5061 8.83398Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        d="M10.3757 17.8076L10.0669 19.981L8.53809 19.9811L8.86734 17.8078L10.3757 17.8076Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        d="M5.22607 19.981L14.3227 19.981L14.3227 21.4102L5.22607 21.4102L5.22607 19.981Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        d="M5.83887 15.2998L14.9116 15.2998L14.9116 16.7435L5.83887 16.7435L5.83887 15.2998Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        d="M6.40137 10.8486L15.9369 10.8486L15.9369 12.2923L6.40137 12.2923L6.40137 10.8486Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        d="M15.8472 10.8096L17.0453 18.2612L15.8607 18.4093L14.6626 10.9576L15.8472 10.8096Z"
        fill={color}
      />
      <Ellipse
        cx="17.0453"
        cy="21.1449"
        rx="1.7284"
        ry="2.25088"
        fill={color}
      />
    </Svg>
  );
};

export default IconCart;
