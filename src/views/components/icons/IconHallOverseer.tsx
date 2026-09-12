import { Path, Svg } from '@react-pdf/renderer';
import { IconProps } from './index.types';

const IconHallOverseer = ({ size = 24, color = '#222222' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 17.683C13.0346 17.4253 13.8926 16.8294 14.574 15.8954C15.2554 14.9614 15.5961 13.9265 15.5961 12.7907V10.494L12 8.69265L8.40385 10.4929V12.7882C8.40385 13.9283 8.74455 14.9647 9.42595 15.8974C10.1074 16.8301 10.9654 17.4253 12 17.683ZM4.5 20.5003V9.25032L12 3.61572L19.5 9.25032V20.5003H4.5ZM5.99997 19.0003H18V10.0003L12 5.5003L5.99997 10.0003V19.0003Z"
      fill={color}
    />
  </Svg>
);

export default IconHallOverseer;
