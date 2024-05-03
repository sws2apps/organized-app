import { MinistryRecord } from './ministry_report.types';

// Function to generate a random date string in UTC
function getRandomDate(): string {
  const year = 2024;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(Date.UTC(year, month, day)).toISOString();
}

// Function to generate random number between min and max
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate random array of Bible studies
function getRandomBibleStudies(): string[] {
  const numberOfStudies = Math.floor(Math.random() * 5) + 1;
  const studies: string[] = [];
  for (let i = 0; i < numberOfStudies; i++) {
    studies.push(`Study ${i + 1}`);
  }
  return studies;
}

export function getTmpMinistryRecords(count: number): MinistryRecord[] {
  const records: MinistryRecord[] = [];
  for (let i = 0; i < count; i++) {
    const record = new MinistryRecord(
      getRandomDate(),
      getRandomNumber(0, 10),
      getRandomNumber(0, 3600),
      getRandomNumber(0, 3600),
      getRandomBibleStudies()
    );
    records.push(record);
  }

  return records;
}
