import { useEffect, useState } from 'react';

const useHookIntersectionObserver = ({
  root,
  selector,
  rootMargin,
}: {
  root: string;
  selector: string;
  rootMargin?: string;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const rootElement = document.querySelector(root);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        });
      },
      { root: rootElement, rootMargin }
    );

    const element = document.querySelector(selector);

    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [root, selector, rootMargin]);

  return visible;
};

export default useHookIntersectionObserver;
