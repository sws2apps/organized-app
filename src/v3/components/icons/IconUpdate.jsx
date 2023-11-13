import PropTypes from 'prop-types';

const IconUpdate = ({ color = '#222222', width = 24, height = 24 }) => {
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
        id="mask0_2710_34461"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2710_34461)">
        <path
          d="M7.25 19.5V18H16.75V19.5H7.25ZM11.25 15.8077V7.35378L8.39035 10.198L7.34615 9.15383L12 4.5L16.6538 9.15383L15.6096 10.198L12.7499 7.35378V15.8077H11.25Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconUpdate.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconUpdate;
