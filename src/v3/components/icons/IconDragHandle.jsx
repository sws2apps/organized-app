import PropTypes from "prop-types";

const IconDragHandle = ({ color = "#222222", width = 24, height = 24 }) => {
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
        id="mask0_3106_64887"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_3106_64887)">
        <path
          d="M4.5 14.75V13.25H19.5V14.75H4.5ZM4.5 10.75V9.25H19.5V10.75H4.5Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconDragHandle.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconDragHandle;
