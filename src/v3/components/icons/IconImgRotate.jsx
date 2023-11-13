import PropTypes from 'prop-types';

const IconImgRotate = ({ color = '#222222', width = 24, height = 24 }) => {
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
        id="mask0_2583_35274"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={width}
        height={height}
      >
        <rect width={width} height={height} fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2583_35274)">
        <path
          d="M6.75003 17.75H17.3269L14.0384 13.3654L11.2308 17.0192L9.23075 14.4616L6.75003 17.75ZM5.3077 21.5C4.80898 21.5 4.38302 21.3234 4.02982 20.9702C3.67661 20.617 3.5 20.191 3.5 19.6923V12.3077H4.99997V19.6923C4.99997 19.782 5.02883 19.8558 5.08653 19.9135C5.14423 19.9712 5.21795 20 5.3077 20H18.6923C18.782 20 18.8557 19.9712 18.9134 19.9135C18.9711 19.8558 19 19.782 19 19.6923V12.3077H20.5V19.6923C20.5 20.191 20.3233 20.617 19.9701 20.9702C19.6169 21.3234 19.191 21.5 18.6923 21.5H5.3077Z"
          fill={color}
        />
        <path
          d="M20.0869 4.00005V9.38463H14.7023V7.88465H17.0831C16.4883 7.00772 15.7107 6.3077 14.7504 5.7846C13.7902 5.26152 12.7357 4.99998 11.5869 4.99998C10.0998 4.99998 8.7786 5.40511 7.62346 6.21538C6.46833 7.02563 5.63307 8.08204 5.11769 9.38463H3.50044C4.04659 7.66283 5.05684 6.25161 6.53119 5.15098C8.00554 4.05033 9.69079 3.5 11.5869 3.5C13.0613 3.5 14.4091 3.84488 15.6302 4.53463C16.8514 5.22438 17.8369 6.14362 18.5869 7.29235V4.00005H20.0869Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

IconImgRotate.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IconImgRotate;
