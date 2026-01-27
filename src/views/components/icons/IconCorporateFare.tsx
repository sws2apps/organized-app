import { G, Path, Svg } from '@react-pdf/renderer';
import { IconProps } from './index.types';

const IconCorporateFare = ({ size = 24, color = '#222222' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G>
        <Path
          d="M2.36548 20.5781V3.07812H11.8652V7.07812H21.6345V20.5781H2.36548ZM3.86523 19.0781H10.3655V16.5781H3.86523V19.0781ZM3.86523 15.0781H10.3655V12.5781H3.86523V15.0781ZM3.86523 11.0781H10.3655V8.57812H3.86523V11.0781ZM3.86523 7.07812H10.3655V4.57812H3.86523V7.07812ZM11.8652 19.0781H20.1347V8.57812H11.8652V19.0781ZM14.0577 12.5781V11.0781H17.75V12.5781H14.0577ZM14.0577 16.5781V15.0781H17.75V16.5781H14.0577Z"
          fill={color}
        />
      </G>
    </Svg>
  );
};

export default IconCorporateFare;
