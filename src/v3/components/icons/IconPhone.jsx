import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconPhone = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-phone" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2704_31559"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2704_31559)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.025 21.9749C6.375 22.3249 6.80257 22.4999 7.3077 22.4999L16.6922 22.5C17.1974 22.5 17.625 22.325 17.975 21.975C18.325 21.625 18.5 21.1974 18.5 20.6923V3.3077C18.5 2.80257 18.325 2.375 17.975 2.025C17.625 1.675 17.1974 1.5 16.6922 1.5H7.3077C6.80257 1.5 6.375 1.675 6.025 2.025C5.675 2.375 5.5 2.80257 5.5 3.3077V20.6923C5.5 21.1974 5.675 21.6249 6.025 21.9749ZM6.99997 20.6923V19.75H7V18.25H6.99997V5.74998H7V4.25003H6.99997V3.30773C6.99997 3.23079 7.03202 3.16027 7.09613 3.09615C7.16024 3.03205 7.23077 3 7.3077 3H16.6922C16.7692 3 16.8397 3.03205 16.9038 3.09615C16.9679 3.16027 17 3.23079 17 3.30773V4H17V20H17V20.6923C17 20.7692 16.9679 20.8397 16.9038 20.9039C16.8397 20.968 16.7692 21 16.6922 21H7.3077C7.23077 21 7.16024 20.968 7.09613 20.9039C7.03202 20.8397 6.99997 20.7692 6.99997 20.6923Z"
            fill={color}
          />
          <rect x="9" y="19" width="6" height="1" rx="0.5" fill={color} />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconPhone.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconPhone;
