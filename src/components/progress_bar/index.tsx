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
  const fillPadding = value > 0 ? '0 5px' : '0';

  return (
    <StyledProgressBarBox>
      <StyledProgressBar>
        <StyledProgressBarFill
          style={{
            width: `${progressValue}%`,
            padding: fillPadding,
         
          }}
        >
          {value > 0 ? value : ''}
        </StyledProgressBarFill>

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
