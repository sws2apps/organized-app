import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconRedo = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-redo ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_4944_2981809"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2981809)">
          <path
            d="M17.0002 18.5004V17.0005H9.8233C8.77971 17.0005 7.88164 16.6559 7.12907 15.9668C6.37651 15.2777 6.00022 14.4267 6.00022 13.4139C6.00022 12.4011 6.37651 11.5517 7.12907 10.8658C7.88164 10.1799 8.77971 9.83699 9.8233 9.83699H16.8445L14.0618 12.6197L15.1156 13.6735L19.7021 9.08701L15.1156 4.50049L14.0618 5.55431L16.8445 8.33704H9.8233C8.3605 8.33704 7.10762 8.82517 6.06467 9.80144C5.02174 10.7777 4.50027 11.9819 4.50027 13.4139C4.50027 14.846 5.02174 16.0517 6.06467 17.0312C7.10762 18.0107 8.3605 18.5004 9.8233 18.5004H17.0002Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRedo;
