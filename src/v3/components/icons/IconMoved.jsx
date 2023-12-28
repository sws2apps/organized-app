import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconMoved = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-moved" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3201_166967"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3201_166967)">
          <path
            d="M9.49997 5.34611C8.99486 5.34611 8.56088 5.1647 8.19805 4.80188C7.83523 4.43905 7.65382 4.00508 7.65382 3.49996C7.65382 2.99484 7.83523 2.56087 8.19805 2.19803C8.56088 1.83522 8.99486 1.65381 9.49997 1.65381C10.0051 1.65381 10.4391 1.83522 10.8019 2.19803C11.1647 2.56087 11.3461 2.99484 11.3461 3.49996C11.3461 4.00508 11.1647 4.43905 10.8019 4.80188C10.4391 5.1647 10.0051 5.34611 9.49997 5.34611ZM3.32693 22.7499L6.09615 8.47686L3.74995 9.46726V12.7499H2.25V8.45381L7.18265 6.42883C7.63265 6.2455 8.07015 6.21184 8.49515 6.32786C8.92015 6.44389 9.25124 6.70254 9.48842 7.10381L10.448 8.69421C10.8916 9.41471 11.4894 10.008 12.2413 10.474C12.9932 10.94 13.8295 11.1923 14.75 11.2307V12.7307C13.6115 12.6922 12.5842 12.3964 11.6682 11.8432C10.7522 11.29 9.99804 10.5942 9.40573 9.75568L8.6615 13.5154L10.7499 15.5846V22.7499H9.25V16.9134L6.71535 14.5192L4.88842 22.7499H3.32693ZM16.9038 22.8461V8.84611H13.1538V2.15381H21.8461V8.84611H18.0961V22.8461H16.9038ZM18.025 7.75378L20.2788 5.49996L18.025 3.24613L17.1712 4.09996L17.975 4.90381H14.6538V6.09611H17.975L17.1712 6.89996L18.025 7.75378Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconMoved.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconMoved;
