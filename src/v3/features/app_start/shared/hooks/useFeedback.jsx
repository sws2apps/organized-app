import { onboardingMessageState, onboardingTitleState } from '@states/app';
import { useRecoilValue } from 'recoil';

const useFeedback = () => {
  const title = useRecoilValue(onboardingTitleState);
  const message = useRecoilValue(onboardingMessageState);

  const onboardingError = document.querySelector('#onboarding-error');

  const hideMessage = () => {
    onboardingError.style.animation = 'fade-out 1s forwards';
  };

  const showMessage = () => {
    onboardingError.style.opacity = 0;
    onboardingError.style.display = 'block';
    onboardingError.style.animation = 'fade-in 1s forwards';
  };

  return { title, message, hideMessage, showMessage };
};

export default useFeedback;
