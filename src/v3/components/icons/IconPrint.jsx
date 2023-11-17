import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconPrint = ({ color = '#222222', width = 24, height = 24 }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon sx={{ width: `${width}px`, height: `${height}px` }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2473_21948"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2473_21948)">
          <path
            d="M16 8.30771V5.30771H8.00005V8.30771H6.50007V3.80774H17.5V8.30771H16ZM17.8077 12.3077C18.0911 12.3077 18.3286 12.2118 18.5202 12.0202C18.7119 11.8285 18.8077 11.591 18.8077 11.3077C18.8077 11.0243 18.7119 10.7868 18.5202 10.5952C18.3286 10.4035 18.0911 10.3077 17.8077 10.3077C17.5244 10.3077 17.2869 10.4035 17.0952 10.5952C16.9036 10.7868 16.8077 11.0243 16.8077 11.3077C16.8077 11.591 16.9036 11.8285 17.0952 12.0202C17.2869 12.2118 17.5244 12.3077 17.8077 12.3077ZM16 19V14.7307H8.00005V19H16ZM17.5 20.5H6.50007V16.5H2.78857V10.8077C2.78857 10.0993 3.03056 9.50561 3.51452 9.02644C3.99849 8.54729 4.58982 8.30771 5.28852 8.30771H18.7116C19.4199 8.30771 20.0136 8.54729 20.4928 9.02644C20.972 9.50561 21.2115 10.0993 21.2115 10.8077V16.5H17.5V20.5ZM19.7116 15V10.8077C19.7116 10.5243 19.6157 10.2868 19.4241 10.0952C19.2324 9.9035 18.9949 9.80766 18.7116 9.80766H5.28852C5.00519 9.80766 4.76769 9.9035 4.57602 10.0952C4.38436 10.2868 4.28852 10.5243 4.28852 10.8077V15H6.50007V13.2308H17.5V15H19.7116Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconPrint.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconPrint;
