import { ProgressBarProps } from './index.types';
import {
  StyledProgressBar,
  StyledProgressBarFill,
  StyledProgressBarBox,
  StyledProgressBarToFill,
} from './index.styles';

/**
 * Props for the ProgressBarSmall component.
 */

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
        {value > 0 && (
          <StyledProgressBarFill style={{ width: `${progressValue}%` }}>
            {value}
          </StyledProgressBarFill>
        )}

        {maxValue - value > 0 && (
          <StyledProgressBarToFill>
            {value === 0 ? 0 : maxValue - value}
          </StyledProgressBarToFill>
        )}
      </StyledProgressBar>
    </StyledProgressBarBox>
  );
};

export default ProgressBar;
