import PropTypes from 'prop-types';

const IconLoadingHourglass = ({ color = '#222222', width = 24, height = 24 }) => {
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
        id="mask0_2653_26742"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2653_26742)">
        <path
          d="M7.90382 20H16.0961V17C16.0961 15.8615 15.6981 14.8878 14.9019 14.0788C14.1058 13.2698 13.1384 12.8654 12 12.8654C10.8615 12.8654 9.8942 13.2698 9.09805 14.0788C8.3019 14.8878 7.90382 15.8615 7.90382 17V20ZM12 11.1346C13.1384 11.1346 14.1058 10.7301 14.9019 9.92113C15.6981 9.11216 16.0961 8.13844 16.0961 6.99998V3.99998H7.90382V6.99998C7.90382 8.13844 8.3019 9.11216 9.09805 9.92113C9.8942 10.7301 10.8615 11.1346 12 11.1346ZM4.5 21.5V20H6.40385V17C6.40385 15.8743 6.71187 14.8496 7.3279 13.9259C7.94393 13.0022 8.76029 12.3602 9.77697 12C8.76029 11.6333 7.94393 10.9897 7.3279 10.0692C6.71187 9.14871 6.40385 8.12563 6.40385 6.99998V3.99998H4.5V2.5H19.5V3.99998H17.5961V6.99998C17.5961 8.12563 17.2881 9.14871 16.672 10.0692C16.056 10.9897 15.2397 11.6333 14.223 12C15.2397 12.3602 16.056 13.0022 16.672 13.9259C17.2881 14.8496 17.5961 15.8743 17.5961 17V20H19.5V21.5H4.5Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconLoadingHourglass.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconLoadingHourglass;
