import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';

// Children.toArray does not expand Fragment elements, so conditional patterns
// like {cond && <><A /><B /></>} would hide A and B from analysis.
// This recursive helper expands all fragments into a flat element list.
const flattenChildren = (children: ReactNode): ReactElement[] => {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    if (child.type === Fragment) {
      return flattenChildren((child.props as { children: ReactNode }).children);
    }
    return [child];
  });
};

/**
 * Automatically promotes the last visible child to the "main" (filled)
 * variant, so there is always a prominent primary action regardless of which
 * buttons are conditionally rendered for the current user.
 *
 * Works with both direct NavBarButton elements and wrapper components that
 * forward the `main` prop to their internal NavBarButton.
 */
const NavBarButtonGroup = ({ children }: { children: ReactNode }) => {
  const flatChildren = flattenChildren(children);

  if (flatChildren.length === 0) return null;

  const lastIndex = flatChildren.length - 1;

  return (
    <>
      {flatChildren.map((child, i) =>
        cloneElement(child as ReactElement<{ main?: boolean; text?: string }>, {
          main: i === lastIndex,
          // keyed by label: when a page swaps its buttons, React must not reuse
          // one button's element for another, or the old look animates out
          // Children.toArray (used here and by the navbar) stamps position
          // keys like ".0", so the label comes first
          key:
            (child.props as { text?: string }).text ??
            child.key ??
            `nav-button-${i}`,
        })
      )}
    </>
  );
};

export default NavBarButtonGroup;
