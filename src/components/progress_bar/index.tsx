import {
  StyledProgressBar,
  StyledProgressBarFill,
  StyledProgressBarBox,
  StyledProgressBarToFill,
} from './progress_bar.styled';

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
const ProgressBar = ({ value, maxValue }: ProgressBarProps) => {
  const progressValue = Math.round((value * 100) / maxValue);

  return (
    <StyledProgressBarBox>
      <StyledProgressBar>
        <StyledProgressBarFill style={{ width: `${progressValue}%` }}>
          {value}
        </StyledProgressBarFill>
        <StyledProgressBarToFill>{maxValue - value}</StyledProgressBarToFill>
      </StyledProgressBar>
    </StyledProgressBarBox>
  );
};

export default ProgressBar;
