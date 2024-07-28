/**
 * Represents the possible variants for a ministry report.
 */
export type MinistryReportVariants =
  | 'empty'
  | 'base'
  | 'pioneer'
  | 'special-pioneer';

export type MinistryRecordActionMode = 'add' | 'edit';

/**
 * Represents a ministry record with details such as date of creation, count of bible studies, hours spent, credit hours, and list of bible studies.
 */
export class MinistryRecord {
  /**
   * Date of creation of the ministry record.
   */
  date_of_creation: string;
  /**
   * Count of bible studies conducted.
   */
  count_of_bible_studies: number;
  /**
   * Total hours spent in seconds.
   */
  hours_in_seconds: number;
  /**
   * Total credit hours in seconds.
   */
  credit_hours_in_seconds: number;
  /**
   * List of bible studies conducted.
   */
  bible_studies: string[];

  /**
   * Creates an instance of MinistryRecord.
   * @param date_of_creation Date of creation of the ministry record.
   * @param count_of_bible_studies Count of bible studies conducted.
   * @param hours_in_seconds Total hours spent in seconds.
   * @param credit_hours_in_seconds Total credit hours in seconds.
   * @param bible_studies List of bible studies conducted.
   */
  constructor(
    date_of_creation: string,
    count_of_bible_studies: number,
    hours_in_seconds: number,
    credit_hours_in_seconds: number,
    bible_studies: string[]
  ) {
    this.date_of_creation = date_of_creation;
    this.count_of_bible_studies = count_of_bible_studies;
    this.hours_in_seconds = hours_in_seconds;
    this.credit_hours_in_seconds = credit_hours_in_seconds;
    this.bible_studies = bible_studies;
  }

  /**
   * Converts the MinistryRecord object to its string representation.
   * @returns A string representation of the MinistryRecord object.
   */
  toString(): string {
    return `{date_of_creation: "${this.date_of_creation}", count_of_bible_studies: ${this.count_of_bible_studies}, 
    hours_in_seconds: ${this.hours_in_seconds}, credit_hours_in_seconds: ${this.credit_hours_in_seconds}, bible_studies: ${this.bible_studies.toString()}}`;
  }

  /**
   * Checks if the MinistryRecord is empty.
   * @returns True if the MinistryRecord is empty, otherwise false.
   */
  isEmpty(): boolean {
    if (
      this.date_of_creation == '' &&
      this.bible_studies.length == 0 &&
      this.count_of_bible_studies == 0 &&
      this.hours_in_seconds == 0 &&
      this.credit_hours_in_seconds == 0
    ) {
      return true;
    }
    return false;
  }
}
