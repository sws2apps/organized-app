import { SongSourceType } from './index.types';
import useSongSource from './useSongSource';
import Typography from '@components/typography';

const SongSource = (props: SongSourceType) => {
  const { songTitle } = useSongSource(props);

  return <Typography className="h4">{songTitle}</Typography>;
};

export default SongSource;
