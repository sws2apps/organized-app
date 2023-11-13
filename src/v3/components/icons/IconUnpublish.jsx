import PropTypes from 'prop-types';

const IconUnpublish = ({ color = '#222222', width = 24, height = 24 }) => {
  width = width.toString();
  height = height.toString();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_3555_641740"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_3555_641740)">
        <path
          d="M9.69998 18.2288L8.64615 17.175L10.9462 14.875L8.64615 12.575L9.69998 11.5212L12 13.8212L14.3 11.5212L15.3538 12.575L13.0538 14.875L15.3538 17.175L14.3 18.2288L12 15.9288L9.69998 18.2288ZM5.3077 21.5C4.80257 21.5 4.375 21.325 4.025 20.975C3.675 20.625 3.5 20.1974 3.5 19.6923V6.30772C3.5 5.80259 3.675 5.37502 4.025 5.02502C4.375 4.67502 4.80257 4.50002 5.3077 4.50002H6.69233V2.38464H8.23075V4.50002H15.8077V2.38464H17.3076V4.50002H18.6923C19.1974 4.50002 19.625 4.67502 19.975 5.02502C20.325 5.37502 20.5 5.80259 20.5 6.30772V19.6923C20.5 20.1974 20.325 20.625 19.975 20.975C19.625 21.325 19.1974 21.5 18.6923 21.5H5.3077ZM5.3077 20H18.6923C18.7692 20 18.8397 19.9679 18.9038 19.9038C18.9679 19.8397 19 19.7692 19 19.6923V10.3077H4.99997V19.6923C4.99997 19.7692 5.03202 19.8397 5.09612 19.9038C5.16024 19.9679 5.23077 20 5.3077 20ZM4.99997 8.80774H19V6.30772C19 6.23079 18.9679 6.16026 18.9038 6.09614C18.8397 6.03204 18.7692 5.99999 18.6923 5.99999H5.3077C5.23077 5.99999 5.16024 6.03204 5.09612 6.09614C5.03202 6.16026 4.99997 6.23079 4.99997 6.30772V8.80774Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconUnpublish.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconUnpublish;
