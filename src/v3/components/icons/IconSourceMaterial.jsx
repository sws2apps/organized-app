import PropTypes from 'prop-types';

const IconSourceMaterial = ({ color = '#222222', width = 24, height = 24 }) => {
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
        id="mask0_2513_2634"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2513_2634)">
        <path
          d="M5.99997 21.5C5.30127 21.5 4.70993 21.258 4.22595 20.774C3.74198 20.29 3.5 19.6987 3.5 19V16.1154H6.5V2.5H20.5V19C20.5 19.6987 20.258 20.29 19.774 20.774C19.29 21.258 18.6987 21.5 18 21.5H5.99997ZM18 20C18.2833 20 18.5208 19.9041 18.7125 19.7125C18.9041 19.5208 19 19.2833 19 19V3.99998H7.99998V16.1154H17V19C17 19.2833 17.0958 19.5208 17.2875 19.7125C17.4791 19.9041 17.7166 20 18 20ZM9.1923 8.69225V7.1923H17.8077V8.69225H9.1923ZM9.1923 11.5769V10.0769H17.8077V11.5769H9.1923ZM5.99997 20H15.5V17.6153H4.99997V19C4.99997 19.2833 5.09581 19.5208 5.28747 19.7125C5.47914 19.9041 5.71664 20 5.99997 20ZM5.99997 20H4.99997H15.5H5.99997Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconSourceMaterial.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconSourceMaterial;
