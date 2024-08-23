import { COTalkType } from './index.types';
import useCOTalk from './useCOTalk';
import Typography from '@components/typography';

const COTalk = (props: COTalkType) => {
  const { title } = useCOTalk(props);

  return (
    <Typography className="h4" color={props.color}>
      {title}
    </Typography>
  );
};

export default COTalk;
