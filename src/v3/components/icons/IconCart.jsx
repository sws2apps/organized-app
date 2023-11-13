import PropTypes from 'prop-types';

const IconCart = ({ color = '#222222', width = 24, height = 24 }) => {
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.93961 0.419067H17.3821L14.5923 21.4322H13.7167L13.5189 22.8925C13.4547 23.2875 13.0709 23.5809 12.6182 23.5809H7.49166C6.94388 23.5809 6.5203 23.1574 6.58902 22.6783L6.71984 21.3883H6.09913L8.93961 0.419067ZM7.94538 19.9885H8.57171L8.31735 22.1373H11.9871L12.2966 19.9885H13.1407L15.5345 1.86273H10.3876L7.94538 19.9885Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.0066 13.1262L12.6977 15.2996L11.1689 15.2997L11.4982 13.1264L13.0066 13.1262Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5784 8.8335L13.2695 11.0068L11.7407 11.007L12.07 8.83365L13.5784 8.8335Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.3787 17.8071L12.0698 19.9805L10.541 19.9806L10.8703 17.8073L12.3787 17.8071Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.946 13.1262L10.6372 15.2996L9.1084 15.2997L9.43765 13.1264L10.946 13.1262Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5061 8.8335L11.1972 11.0068L9.66846 11.007L9.99771 8.83365L11.5061 8.8335Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.3757 17.8071L10.0669 19.9805L8.53809 19.9806L8.86734 17.8073L10.3757 17.8071Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.22607 19.9805L14.3227 19.9805L14.3227 21.4097L5.22607 21.4097L5.22607 19.9805Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.83887 15.2996L14.9116 15.2996L14.9116 16.7432L5.83887 16.7432L5.83887 15.2996Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.40137 10.8481L15.9369 10.8481L15.9369 12.2918L6.40137 12.2918L6.40137 10.8481Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.8472 10.8093L17.0453 18.261L15.8607 18.409L14.6626 10.9573L15.8472 10.8093Z"
        fill={color}
      />
      <ellipse cx="17.0453" cy="21.1447" rx="1.7284" ry="2.25088" fill={color} />
    </svg>
  );
};

IconCart.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconCart;
