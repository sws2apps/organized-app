import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

const IconSearch = ({ color = '#222222', width = 24, height = 24, sx = {} }) => {
  width = width.toString();
  height = height.toString();

  return (
    <SvgIcon id="organized-icon-search" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2675_32305"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2675_32305)">
          <path
            d="M19.5422 20.5769L13.2615 14.2961C12.7615 14.7089 12.1865 15.032 11.5365 15.2653C10.8865 15.4987 10.214 15.6153 9.51916 15.6153C7.80999 15.6153 6.36348 15.0236 5.17961 13.84C3.99574 12.6564 3.40381 11.2103 3.40381 9.50157C3.40381 7.79284 3.99559 6.34616 5.17916 5.16154C6.36273 3.97694 7.80888 3.38464 9.51761 3.38464C11.2263 3.38464 12.673 3.97658 13.8576 5.16044C15.0422 6.34431 15.6345 7.79083 15.6345 9.49999C15.6345 10.2141 15.5147 10.8961 15.2749 11.5461C15.0352 12.1961 14.7153 12.7615 14.3153 13.2423L20.5961 19.5231L19.5422 20.5769ZM9.51916 14.1154C10.8076 14.1154 11.899 13.6683 12.7932 12.774C13.6874 11.8798 14.1346 10.7885 14.1346 9.49999C14.1346 8.21153 13.6874 7.12018 12.7932 6.22594C11.899 5.33171 10.8076 4.88459 9.51916 4.88459C8.23069 4.88459 7.13934 5.33171 6.24511 6.22594C5.35089 7.12018 4.90378 8.21153 4.90378 9.49999C4.90378 10.7885 5.35089 11.8798 6.24511 12.774C7.13934 13.6683 8.23069 14.1154 9.51916 14.1154Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

IconSearch.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
};

export default IconSearch;
