import PropTypes from 'prop-types';
import { Markup } from 'interweave';

const CPETextMarkup = ({ content = '', className = '', color = 'var(--black)', style = {} }) => {
  const transformText = (node, children) => {
    if (node.tagName.toLowerCase() === 'p') {
      return (
        <p className={`text-markup ${className}`} style={{ color, ...style }}>
          {children}
        </p>
      );
    }

    if (node.tagName.toLowerCase() === 'a') {
      return (
        <a
          className="body-small-semibold"
          style={{ color: 'var(--accent-main)' }}
          href={node.getAttribute('href')}
          title={node.getAttribute('title')}
        >
          {children}
        </a>
      );
    }
  };

  return <Markup content={content} transform={transformText} />;
};

CPETextMarkup.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
};

export default CPETextMarkup;
