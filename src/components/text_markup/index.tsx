import { LegacyRef, createElement } from 'react';
import { Markup as InterWeaveMarkup } from 'interweave';
import { TextMarkupTypeProps } from './index.types';

/**
 * A custom text markup component that allows rendering HTML content with custom styling and anchor handling.
 *
 * @param {TextMarkupTypeProps} props - The props for the CustomTextMarkup component.
 * @returns {JSX.Element} A CustomTextMarkup component.
 */
const Markup = (props: TextMarkupTypeProps) => {
  let content = props.content || '';
  const color = props.color || 'var(--black)';
  const anchorClassName = props.anchorClassName || 'body-small-semibold';
  const anchorColor = props.anchorColor || 'var(--accent-dark)';

  content = content.startsWith('<') ? content : `<p>${content}</p>`;

  const transformText = (node, children) => {
    const tagName = node.tagName.toLowerCase();

    if (tagName === 'p') {
      return (
        <p
          className={`text-markup ${props.className}`}
          style={{ color, ...props.style }}
        >
          {children}
        </p>
      );
    }

    if (tagName === 'a') {
      return (
        <a
          className={anchorClassName}
          style={{
            color: anchorColor,
            ...props.anchorStyle,
            cursor: 'pointer',
          }}
          href={node.getAttribute('href')}
          title={node.getAttribute('title')}
          id={node.getAttribute('id')}
          target={node.getAttribute('target')}
          ref={props.anchorRef as LegacyRef<HTMLAnchorElement>}
          onClick={props.anchorClick}
        >
          {children}
        </a>
      );
    }

    if (tagName === 'ul') {
      return (
        <ul
          className={props.className}
          style={{
            paddingInlineStart: '32px',
            color,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {children}
        </ul>
      );
    }

    // Check if the tag has a class name assigned in the props
    if (props.tagClassNames && props.tagClassNames[tagName]) {
      return createElement(
        tagName,
        { className: props.tagClassNames[tagName] },
        children
      );
    }
  };

  return <InterWeaveMarkup content={content} transform={transformText} />;
};

export default Markup;
