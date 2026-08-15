import { Path, Svg } from '@react-pdf/renderer';
import { IconProps } from './index.types';

const IconMicrophone = ({ size = 24, color = '#222222' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fillRule="evenodd"
      d="M14.2982 22.9604L15.6115 11.1528H8.38818L9.70146 22.9604H14.2982ZM12.8657 21.5604H11.1743L10.293 12.656H13.747L12.8657 21.5604Z"
      fill={color}
    />
    <Path
      d="M7.38574 5.71442C7.38574 3.42111 9.24484 1.56201 11.5381 1.56201H12.4616C14.7549 1.56201 16.614 3.42111 16.614 5.71442V8.81335C16.614 9.36564 16.1663 9.81335 15.614 9.81335H8.38574C7.83346 9.81335 7.38574 9.36564 7.38574 8.81335V5.71442Z"
      fill={color}
    />
  </Svg>
);

export default IconMicrophone;
