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
  const progressValue = Math.round((value * 100) / maxValue);

  const progressBarWidth =
    maxValue > 0 && value === maxValue ? 'calc(100% - 26px)' : '100%';

  return (
    <StyledProgressBarSmallBox style={{ width: '100%' }}>
      <StyledProgressBarSmall style={{ width: progressBarWidth }}>
        <StyledProgressBarSmallFill style={{ width: `${progressValue}%` }} />
      </StyledProgressBarSmall>
      {maxValue > 0 && value === maxValue && (
        <StyledProgressBarSmallCheck>
          <IconCheck color="var(--accent-main)" />
        </StyledProgressBarSmallCheck>
      )}
    </StyledProgressBarSmallBox>
  );
};

export default ProgressBarSmall;
