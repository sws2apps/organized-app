import animationData from '@assets/lotties/organized-3d-loader.json';
import { Box } from '@mui/material';
import Lottie from 'react-lottie';

/**
 * Organized3DLoader Component
 *
 * A reusable loading component that displays a 3D animated loader using the Lottie animation library.
 * It allows customization of its width, height, and whether it should be centered on the screen.
 *
 * @param {number} width - Optional. The width of the animation. Default is 72.
 * @param {number} height - Optional. The height of the animation. Default is 72.
 * @param {boolean} centered - Optional. If true, the loader will be centered in the container. Default is true.
 *
 * @returns {JSX.Element} A loader animation wrapped in a Box container from Material UI.
 */
const Organized3DLoader = ({
  width = 72,
  height = 72,
  centered = true,
}: {
  width?: number;
  height?: number;
  centered?: boolean;
}) => {
  const defaultOptions = {
    loop: true,
    speed: 1.3,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return centered ? (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          margin: 'auto',
        }}
      >
        <Lottie options={defaultOptions} width={width} height={height} />
      </Box>
    </Box>
  ) : (
    <Lottie options={defaultOptions} width={width} height={height} />
  );
};

export default Organized3DLoader;
