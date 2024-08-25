import { DetailsRowProps } from '../details_row/index.types';

const useMeetingContainer = () => {
  const labels: DetailsRowProps['type'][] = ['count', 'total', 'average'];

  return { labels };
};

export default useMeetingContainer;
