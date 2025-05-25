import { IconPause, IconResume, IconStart } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { RightButtonProps } from './index.types';
import TimerButton from '../timer_button';

const RightButton = ({ onClick, state }: RightButtonProps) => {
  const { t } = useAppTranslation();

  const { isGroup } = useCurrentUser();

  switch (state) {
    case 'not_started':
      return (
        <TimerButton
          text={t('tr_timerLabelStart')}
          icon={
            <IconStart
              color={isGroup ? 'var(--red-dark)' : 'var(--accent-dark)'}
            />
          }
          onClick={onClick}
        />
      );

    case 'started':
      return (
        <TimerButton
          text={t('tr_timerLabelPause')}
          icon={
            <IconPause
              color={isGroup ? 'var(--red-dark)' : 'var(--accent-dark)'}
            />
          }
          onClick={onClick}
        />
      );

    case 'paused':
      return (
        <TimerButton
          text={t('tr_timerLabelResume')}
          icon={
            <IconResume
              color={isGroup ? 'var(--red-dark)' : 'var(--accent-dark)'}
            />
          }
          onClick={onClick}
        />
      );
  }
};

export default RightButton;
