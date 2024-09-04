import { useAppTranslation } from '@hooks/index';
import { BranchReportType } from '@definition/branch_report';
import { ReportSelectorProps } from './index.types';
import useReportSelector from './useReportSelector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const ReportSelector = ({ value, onChange }: ReportSelectorProps) => {
  const { t } = useAppTranslation();

  const { REPORTS } = useReportSelector();

  return (
    <Select
      label={t('tr_chooseReport')}
      value={value}
      onChange={(e) => onChange(e.target.value as BranchReportType)}
    >
      {REPORTS.map((report) => (
        <MenuItem key={report.value} value={report.value}>
          <Typography>{report.name}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default ReportSelector;
