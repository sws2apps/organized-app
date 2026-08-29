import { SvgIcon } from '@mui/material';
import { IconProps } from './iconTypes';

const IconInstallDesktop = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={['organized-icon-install-desktop', className]
        .filter(Boolean)
        .join(' ')}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
      viewBox="0 -960 960 960"
    >
      <path
        d="M340-140v-80H172.31Q142-220 121-241q-21-21-21-51.31v-455.38Q100-778 121-799q21-21 51.31-21h306.15v60H172.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v455.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h615.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-390h60v97.69Q860-262 839-241q-21 21-51.31 21H620v80H340Zm336.92-275L490.77-601.15l41.77-41.77 114.38 113.77V-820h60v290.85l114.39-113.77 41.77 41.77L676.92-415Z"
        fill={color}
      />
    </SvgIcon>
  );
};

export default IconInstallDesktop;
