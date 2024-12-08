import {
  onboardingMessageState,
  onboardingTitleState,
  onboardingVariantState,
} from '@states/app';
import { useRecoilValue } from 'recoil';

const useFeedback = () => {
  const title = useRecoilValue(onboardingTitleState);
  const message = useRecoilValue(onboardingMessageState);
  const variant = useRecoilValue(onboardingVariantState);

  const onboardingError =
    document.querySelector<HTMLElement>('#onboarding-error');

  const hideMessage = () => {
    if (onboardingError) {
      onboardingError.style.animation = 'fade-out 0.15s forwards';
    }
  };

  const showMessage = () => {
    onboardingError.style.opacity = '0';
    onboardingError.style.display = 'block';
    onboardingError.style.animation = 'fade-in 0.15s forwards';
  };

  return { title, message, variant, hideMessage, showMessage };
};

export default useFeedback;
