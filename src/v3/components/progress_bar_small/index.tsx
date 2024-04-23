import {
  StyledProgressBarSmall,
  StyledProgressBarSmallFill,
  StyledProgressBarSmallCheck,
  StyledProgressBarSmallBox,
} from './progress_bar_small.styled';
import IconCheck from '@components/icons/IconCheck';

/**
 * Props for the ProgressBarSmall component.
 */
interface ProgressBarProps {
  /**
   * The current value of the progress bar.
   */
  value: number;

  /**
   * The maximum value of the progress bar.
   */
  maxValue: number;
}

/**
 * A small progress bar component.
 * @param value - The current value of the progress bar.
 * @param maxValue - The maximum value of the progress bar.
 */
const ProgressBarSmall = ({ value, maxValue }: ProgressBarProps) => {
  const progressValue = Math.min(Math.max(value, 0), maxValue);

  const progressBarWidth = progressValue === maxValue ? 'calc(96px - 26px)' : '96px';

  return (
    <StyledProgressBarSmallBox style={{ width: '96px' }}>
      <StyledProgressBarSmall style={{ width: progressBarWidth }}>
        <StyledProgressBarSmallFill style={{ width: `${progressValue}%` }} />
      </StyledProgressBarSmall>
      {progressValue === maxValue && (
        <StyledProgressBarSmallCheck>
          <IconCheck color="var(--accent-main)" />
        </StyledProgressBarSmallCheck>
      )}
    </StyledProgressBarSmallBox>
  );
};

export default ProgressBarSmall;
