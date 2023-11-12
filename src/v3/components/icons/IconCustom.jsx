import PropTypes from "prop-types";

const IconCustom = ({ color = "#222222", width = 24, height = 24 }) => {
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
        id="mask0_2799_54678"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2799_54678)">
        <path
          d="M2 23.9999V21.9999H22V23.9999H2ZM6 16.8269H7.07308L15.8731 8.03264L15.3404 7.48072L14.7942 6.95379L6 15.7538V16.8269ZM5 17.8269V15.3269L16.2192 4.11339C16.3256 4.00698 16.442 3.92941 16.5683 3.88069C16.6946 3.83197 16.8232 3.80762 16.9542 3.80762C17.0852 3.80762 17.2122 3.83197 17.335 3.88069C17.4578 3.92941 17.5744 4.0089 17.6846 4.11917L18.7135 5.15379C18.8237 5.26019 18.9022 5.37534 18.949 5.49924C18.9958 5.62314 19.0192 5.75117 19.0192 5.88332C19.0192 6.00722 18.9949 6.13333 18.9461 6.26164C18.8974 6.38996 18.8198 6.50722 18.7135 6.61342L7.5 17.8269H5ZM15.8731 8.03264L15.3404 7.48072L14.7942 6.95379L15.8731 8.03264Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconCustom.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconCustom;
