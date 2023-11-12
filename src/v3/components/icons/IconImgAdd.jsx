import PropTypes from "prop-types";

const IconImgAdd = ({ color = "#222222", width = 24, height = 24 }) => {
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
        id="mask0_2583_35276"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2583_35276)">
        <path
          d="M5.11529 20.4999C4.61818 20.4999 4.19262 20.3229 3.83862 19.9689C3.48462 19.6149 3.30762 19.1893 3.30762 18.6922V5.30768C3.30762 4.81056 3.48462 4.38501 3.83862 4.03101C4.19262 3.67699 4.61818 3.49998 5.11529 3.49998H13.8076V4.99996H5.11529C5.02554 4.99996 4.95182 5.02881 4.89412 5.08651C4.83642 5.14421 4.80757 5.21793 4.80757 5.30768V18.6922C4.80757 18.782 4.83642 18.8557 4.89412 18.9134C4.95182 18.9711 5.02554 19 5.11529 19H18.4999C18.5896 19 18.6633 18.9711 18.721 18.9134C18.7787 18.8557 18.8076 18.782 18.8076 18.6922V9.99996H20.3075V18.6922C20.3075 19.1893 20.1305 19.6149 19.7765 19.9689C19.4225 20.3229 18.997 20.4999 18.4999 20.4999H5.11529ZM17.1922 8.61531V6.61531H15.1922V5.11536H17.1922V3.11536H18.6922V5.11536H20.6922V6.61531H18.6922V8.61531H17.1922ZM6.55762 16.7499H17.1344L13.846 12.3654L11.0383 16.0192L9.03837 13.4615L6.55762 16.7499Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconImgAdd.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconImgAdd;
