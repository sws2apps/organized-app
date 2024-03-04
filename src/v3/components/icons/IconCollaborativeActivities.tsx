import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCollaborativeActivities = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-collaborative-activities" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4683_164277"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4683_164277)">
          <path
            d="M5.63453 12.689L2.21533 9.26983L5.63453 5.86025L9.04411 9.26983L5.63453 12.689ZM9.40378 22.0006V17.2025C8.40635 17.1191 7.41565 17.0047 6.43168 16.8592C5.4477 16.7137 4.47045 16.514 3.49993 16.2602L3.86531 14.7602C5.20762 15.1115 6.55215 15.3564 7.89888 15.4948C9.24562 15.6333 10.6123 15.7025 11.9989 15.7025C13.3855 15.7025 14.7525 15.6333 16.0999 15.4948C17.4473 15.3564 18.7922 15.1115 20.1345 14.7602L20.4999 16.2602C19.5294 16.514 18.5521 16.7137 17.5681 16.8592C16.5842 17.0047 15.5935 17.1191 14.596 17.2025V22.0006H9.40378ZM5.63453 10.591L6.94608 9.26983L5.63453 7.95828L4.31336 9.26983L5.63453 10.591ZM11.9999 7.6929C11.2627 7.6929 10.6361 7.4349 10.1201 6.91888C9.60409 6.40285 9.34608 5.77624 9.34608 5.03908C9.34608 4.30191 9.60409 3.67531 10.1201 3.15928C10.6361 2.64326 11.2627 2.38525 11.9999 2.38525C12.7371 2.38525 13.3637 2.64326 13.8797 3.15928C14.3957 3.67531 14.6537 4.30191 14.6537 5.03908C14.6537 5.77624 14.3957 6.40285 13.8797 6.91888C13.3637 7.4349 12.7371 7.6929 11.9999 7.6929ZM11.9999 14.3948C11.4922 14.3948 11.0576 14.214 10.6961 13.8525C10.3345 13.491 10.1538 13.0564 10.1538 12.5487C10.1538 12.041 10.3345 11.6064 10.6961 11.2448C11.0576 10.8833 11.4922 10.7025 11.9999 10.7025C12.5076 10.7025 12.9422 10.8833 13.3038 11.2448C13.6653 11.6064 13.8461 12.041 13.8461 12.5487C13.8461 13.0564 13.6653 13.491 13.3038 13.8525C12.9422 14.214 12.5076 14.3948 11.9999 14.3948ZM11.9999 6.19293C12.3217 6.19293 12.5945 6.08107 12.8182 5.85735C13.0419 5.63364 13.1538 5.36088 13.1538 5.03908C13.1538 4.71728 13.0419 4.44452 12.8182 4.2208C12.5945 3.99709 12.3217 3.88523 11.9999 3.88523C11.6781 3.88523 11.4053 3.99709 11.1816 4.2208C10.9579 4.44452 10.8461 4.71728 10.8461 5.03908C10.8461 5.36088 10.9579 5.63364 11.1816 5.85735C11.4053 6.08107 11.6781 6.19293 11.9999 6.19293ZM17.0211 12.4237L15.5134 9.76983L17.0211 7.116H20.0076L21.5153 9.76983L20.0076 12.4237H17.0211ZM17.8762 10.9237H19.1557L19.7922 9.76983L19.1525 8.61598H17.873L17.2364 9.76983L17.8762 10.9237Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCollaborativeActivities;
