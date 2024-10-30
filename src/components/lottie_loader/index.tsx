import Lottie from 'react-lottie-player';
import animationData from '@assets/lotties/loader.json';

const LottieLoader = ({ size = 72 }: { size?: number }) => {
  return (
    <Lottie
      loop
      animationData={animationData}
      speed={1.3}
      play
      style={{ width: size, height: size }}
    />
  );
};

export default LottieLoader;
