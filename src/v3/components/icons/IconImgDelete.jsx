import PropTypes from "prop-types";

const IconImgDelete = ({ color = "#222222", width = 24, height = 24 }) => {
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
        id="mask0_2583_35275"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2583_35275)">
        <path
          d="M5.11529 20.4999C4.61818 20.4999 4.19262 20.3229 3.83862 19.9689C3.48462 19.6149 3.30762 19.1894 3.30762 18.6923V5.3077C3.30762 4.81058 3.48462 4.38503 3.83862 4.03103C4.19262 3.67701 4.61818 3.5 5.11529 3.5H10V4.99998H5.11529C5.02554 4.99998 4.95182 5.02882 4.89412 5.08652C4.83642 5.14423 4.80757 5.21795 4.80757 5.3077V18.6923C4.80757 18.782 4.83642 18.8557 4.89412 18.9134C4.95182 18.9711 5.02554 19 5.11529 19H18.4999C18.5896 19 18.6633 18.9711 18.721 18.9134C18.7787 18.8557 18.8076 18.782 18.8076 18.6923V13H20.3075V18.6923C20.3075 19.1894 20.1305 19.6149 19.7765 19.9689C19.4225 20.3229 18.997 20.4999 18.4999 20.4999H5.11529ZM6.55762 16.75H17.1344L13.846 12.3654L11.0383 16.0192L9.03837 13.4616L6.55762 16.75Z"
          fill={color}
        />
        <mask
          id="mask1_2583_35275"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="11"
          y="2"
          width="10"
          height="10"
        >
          <rect x="11" y="2" width="10" height="10" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask1_2583_35275)">
          <path
            d="M13.802 11.104C13.4339 11.104 13.1232 10.9772 12.8697 10.7238C12.6162 10.4703 12.4895 10.1595 12.4895 9.79146V4.61438H11.8333V3.30188H14.5103V2.64563H17.4687V3.30188H20.1666V4.61438H19.5103V9.79146C19.5103 10.1595 19.3836 10.4703 19.1301 10.7238C18.8767 10.9772 18.5659 11.104 18.1978 11.104H13.802ZM18.1978 4.61438H13.802V9.79146H18.1978V4.61438ZM14.5624 9.07271H15.6353V5.32271H14.5624V9.07271ZM16.3645 9.07271H17.4374V5.32271H16.3645V9.07271Z"
            fill={color}
          />
        </g>
      </g>
    </svg>
  );
};

IconImgDelete.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconImgDelete;
