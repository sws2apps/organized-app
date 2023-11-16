import PropTypes from 'prop-types';

const IconToggle = ({ color = '#222222', width = 24, height = 24 }) => {
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
      <ellipse id="toggle" cx="9.31666" cy="9" rx="9.00001" ry="9" fill={color} />
    </svg>
  );
};

IconToggle.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconToggle;
