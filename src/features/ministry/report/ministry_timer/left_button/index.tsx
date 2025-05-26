import { IconAddTime, IconStop } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { LeftButtonProps } from './index.types';
import TimerButton from '../timer_button';

const LeftButton = ({ onClick, state }: LeftButtonProps) => {
  const { t } = useAppTranslation();

  const { isGroup } = useCurrentUser();

  switch (state) {
    case 'not_started':
      return (
        <TimerButton
          text={t('tr_timerLabelTime')}
          icon={
            <IconAddTime
              color={isGroup ? 'var(--red-dark)' : 'var(--accent-dark)'}
            />
          }
          onClick={onClick}
        />
      );

    default:
      return (
        <TimerButton
          text={t('tr_timerLabelStop')}
          icon={
            <IconStop
              color={isGroup ? 'var(--red-dark)' : 'var(--accent-dark)'}
            />
          }
          onClick={onClick}
        />
      );
  }
};

export default LeftButton;
