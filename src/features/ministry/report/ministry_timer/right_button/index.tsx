import { IconPause, IconResume, IconStart } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { RightButtonProps } from './index.types';
import TimerButton from '../timer_button';

const RightButton = ({ onClick, state }: RightButtonProps) => {
  const { t } = useAppTranslation();

  switch (state) {
    case 'not_started':
      return (
        <TimerButton
          text={t('tr_timerLabelStart')}
          icon={<IconStart color="var(--accent-dark)" />}
          onClick={onClick}
        />
      );

    case 'started':
      return (
        <TimerButton
          text={t('tr_timerLabelPause')}
          icon={<IconPause color="var(--accent-dark)" />}
          onClick={onClick}
        />
      );

    case 'paused':
      return (
        <TimerButton
          text={t('tr_timerLabelResume')}
          icon={<IconResume color="var(--accent-dark)" />}
          onClick={onClick}
        />
      );
  }
};

export default RightButton;
