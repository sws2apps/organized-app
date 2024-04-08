/**
 * Enum representing the possible states of the Ministry Timer.
 */
export enum MinistryTimerStates {
  /** Represents the initial state of the timer. */
  Zero,
  /** Represents the state when the timer has been started. */
  Started,
  /** Represents the state when the timer has been paused. */
  Paused,
}

/**
 * Props interface for the Ministry Timer Button Component.
 */
export type MinistryTimerButtonProps = {
  /** The current state of the Ministry Timer. */
  state: MinistryTimerStates;
  /** Function to be called when the button is clicked. */
  onClick: VoidFunction;
};
