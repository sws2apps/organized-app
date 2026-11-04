import { View } from '@react-pdf/renderer';

// react-pdf has no box shadow, so a soft one is stacked from faint, growing
// layers, set a little lower than the box it sits under
const Shadow = ({
  radius,
  spread = 6,
  drop = 5,
  opacity = 0.012,
}: {
  radius: number;
  spread?: number;
  drop?: number;
  opacity?: number;
}) => (
  <>
    {Array.from({ length: spread }, (_, index) => index + 1).map((step) => (
      <View
        key={step}
        style={{
          position: 'absolute',
          top: drop - step,
          bottom: -drop - step,
          left: -step,
          right: -step,
          borderRadius: radius + step,
          backgroundColor: '#000000',
          opacity,
        }}
      />
    ))}
  </>
);

export default Shadow;
