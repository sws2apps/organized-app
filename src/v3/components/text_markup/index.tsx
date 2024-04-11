import { LegacyRef } from 'react';
import { Markup } from 'interweave';
import { TextMarkupTypeProps } from './index.types';

const CustomTextMarkup = (props: TextMarkupTypeProps) => {
  let content = props.content || '';
  const color = props.color || 'var(--black)';
  const anchorClassName = props.anchorClassName || 'body-small-semibold';
  const anchorColor = props.anchorColor || 'var(--accent-dark)';

  content = content.startsWith('<') ? content : `<p>${content}</p>`;

  const transformText = (node, children) => {
    if (node.tagName.toLowerCase() === 'p') {
      return (
        <p className={`text-markup ${props.className}`} style={{ color, ...props.style }}>
          {children}
        </p>
      );
    }

    if (node.tagName.toLowerCase() === 'a') {
      return (
        <a
          className={anchorClassName}
          style={{ color: anchorColor, ...props.anchorStyle }}
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

    if (node.tagName.toLowerCase() === 'ul') {
      return <ul style={{ paddingInlineStart: '32px', color }}>{children}</ul>;
    }
  };

  return <Markup content={content} transform={transformText} />;
};

export default CustomTextMarkup;
