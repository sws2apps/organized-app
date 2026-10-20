import { pdf } from '@react-pdf/renderer';
import { RowPagesType, TemplateHallCleaningProps } from './index.types';
import TemplateHallCleaning from '.';

// react-pdf only knows the page breaks after layout: a first pass records the
// page of every table row, the second rounds the tables on each page with it.
// The corners do not change any size, so the breaks stay where they were.
const renderHallCleaning = async (props: TemplateHallCleaningProps) => {
  if (props.layout === 'cards' || props.layout === 'rotation') {
    return pdf(<TemplateHallCleaning {...props} />).toBlob();
  }

  const rowPages: RowPagesType = {};

  await pdf(
    <TemplateHallCleaning
      {...props}
      onRowPage={(id, page) => {
        rowPages[id] = page;
      }}
    />
  ).toBlob();

  return pdf(<TemplateHallCleaning {...props} rowPages={rowPages} />).toBlob();
};

export default renderHallCleaning;
