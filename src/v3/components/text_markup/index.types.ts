import { CSSProperties, LegacyRef, MutableRefObject } from 'react';

export type TextMarkupTypeProps = {
  content: string;
  className: string;
  color?: string;
  style?: React.CSSProperties;
  anchorClassName?:
    | 'huge-numbers'
    | 'big-numbers'
    | 'label-small-medium'
    | 'label-small-regular'
    | 'h1'
    | 'h2'
    | 'h2-caps'
    | 'h3'
    | 'h4'
    | 'button-caps'
    | 'body-regular'
    | 'body-small-semibold'
    | 'body-small-regular';
  anchorColor?: string;
  anchorRef?: MutableRefObject<HTMLElement> | LegacyRef<HTMLAnchorElement>;
  anchorStyle?: CSSProperties;
};
