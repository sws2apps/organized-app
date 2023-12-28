import PropTypes from 'prop-types';
import { Markup } from 'interweave';

const CPETextMarkup = ({
  content = '',
  className = '',
  color = 'var(--black)',
  style = {},
  anchorClassName = 'body-small-semibold',
  anchorColor = 'var(--accent-main)',
  anchorRef,
  anchorStyle = {},
}) => {
  content = content.startsWith('<') ? content : `<p>${content}</p>`;

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
          className={anchorClassName}
          style={{ color: anchorColor, ...anchorStyle }}
          href={node.getAttribute('href')}
          title={node.getAttribute('title')}
          id={node.getAttribute('id')}
          target={node.getAttribute('target')}
          ref={anchorRef}
        >
          {children}
        </a>
      );
    }

    if (node.tagName.toLowerCase() === 'ul') {
      return <ul style={{ paddingInlineStart: '32px', color }}>{children}</ul>;
    }
  };

  return <Markup content={content} transform={transformText} />;
};

CPETextMarkup.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  anchorStyle: PropTypes.object,
  anchorClassName: PropTypes.string,
  anchorColor: PropTypes.string,
  anchorRef: PropTypes.any,
};

export default CPETextMarkup;
