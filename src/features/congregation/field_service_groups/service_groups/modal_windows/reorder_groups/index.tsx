import CustomTypography from '@components/typography';
import { StyledModalWindowConatiner } from '../modal_window.styled';
import { ReorderGroupsModalWindowProps } from './reorder_groups.types';
import useAppTranslation from '@hooks/useAppTranslation';
import CustomDragList from '../../components/drag_list';
import { Box } from '@mui/material';
import CustomButton from '@components/button';

const ReorderGroupsModalWindow = (props: ReorderGroupsModalWindowProps) => {
  const { t } = useAppTranslation();

  const groupDataToText = (groupNum: string, groupName: string) => {
    return `<p class="body-regular" style="color: var(--black)"><span class="h4" style="color: var(--black)">${t('tr_groupNumber', { groupNumber: groupNum })}</span> - ${groupName}</p>`;
  };

  const textToGroupData = (
    text: string
  ): { groupNum: string; groupName: string } | null => {
    const regex =
      /<p class="body-regular" style="color: var\(--black\)"><span class="h4" style="color: var\(--black\)">(.*?)<\/span> - (.*?)<\/p>/;
    const match = text.match(regex);

    if (match) {
      const groupNum = match[1];
      const groupName = match[2];
      return { groupNum, groupName };
    }

    return null;
  };

  let reorderedGroups = [];

  return (
    <StyledModalWindowConatiner
      sx={{
        width: '100%',
      }}
    >
      <CustomTypography className="h2">
        {t('tr_reorderGroupsTitle')}
      </CustomTypography>
      <CustomDragList
        values={props.groups.map((value) => {
          return groupDataToText(value.groupNum, value.groupName);
        })}
        variant={'reorder'}
        onChange={(groups) => {
          reorderedGroups = groups.map((value) => {
            return textToGroupData(value);
          });
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <CustomButton
          variant="main"
          onClick={() => {
            props.onChange(reorderedGroups);
          }}
        >
          {t('tr_save')}
        </CustomButton>
        <CustomButton variant="secondary" onClick={props.onCancelButtonClick}>
          {t('tr_cancel')}
        </CustomButton>
      </Box>
    </StyledModalWindowConatiner>
  );
};

export default ReorderGroupsModalWindow;
