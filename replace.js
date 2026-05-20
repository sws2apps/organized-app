const fs = require('node:fs');

const files = [
  'src/features/congregation/settings/meeting_settings/weekend/day_time/useDayTime.tsx',
  'src/features/congregation/settings/meeting_settings/weekend/study_conductor/useStudyConductor.tsx',
  'src/features/congregation/settings/meeting_settings/weekend/monthly_warning/useMonthlyWarning.tsx',
  'src/features/congregation/settings/meeting_settings/weekend/assignment_preferences/useAssignmentPreferences.tsx',
  'src/features/congregation/settings/meeting_settings/useMeetingSettings.tsx',
  'src/features/congregation/settings/meeting_settings/midweek/linked_parts/useLinkedParts.tsx',
  'src/features/congregation/settings/meeting_settings/midweek/auxiliary_classroom/useAuxiliaryClassroom.tsx',
  'src/features/congregation/settings/meeting_settings/midweek/day_time/useDayTime.tsx',
  'src/features/congregation/settings/meeting_forms/name_format/useNameFormat.tsx',
  'src/features/congregation/settings/meeting_forms/display_name/useDisplayName.tsx',
  'src/features/congregation/settings/meeting_forms/midweek_exact_date/useMidweekExactDate.tsx',
  'src/features/congregation/settings/meeting_forms/songs_weekend/useSongsWeekend.tsx',
  'src/features/congregation/settings/meeting_forms/date_format/useDateFormat.tsx',
  'src/features/congregation/settings/meeting_forms/source_language/useSourceLanguage.tsx',
  'src/features/congregation/settings/congregation_basic/meeting_attendance/useMeetingAttendance.tsx',
  'src/features/congregation/settings/first_day_week/useFirstDayWeek.ts'
];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    // Add import if missing
    if (!content.includes('useDataView')) {
      content = content.replace(/(import .* from '@hooks\/index';?)/, "$1\nimport { useDataView } from '@hooks/useDataView';");
      if (!content.includes('useDataView')) {
        content = "import { useDataView } from '@hooks/useDataView';\n" + content;
      }
    }

    // Replace usage
    content = content.replaceAll('const dataView = useAtomValue(userDataViewState);', 'const dataView = useDataView();');

    // Clean up unused import
    if (!content.includes('userDataViewState') || content.match(/userDataViewState/g).length === 1) {
      content = content.replace(/userDataViewState,?/g, '');
      content = content.replace(/import\s*{\s*}\s*from\s*'@states\/settings';/g, '');
    }

    fs.writeFileSync(file, content);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
});

console.log('Done');
