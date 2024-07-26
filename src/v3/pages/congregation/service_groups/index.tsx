import { useAppTranslation } from '@hooks/index';
import { Button, DarkOverlay, PageTitle } from '@components/index';
import {
  IconAdd,
  IconEdit,
  IconMore,
  IconPerson,
  IconRemovePerson,
  IconReorder,
  IconVisitors,
  IconAssistant,
} from '@icons/index';
import { Box, IconButton, Stack, MenuItem, ListItemIcon, ListItemText, Menu, ListItem } from '@mui/material';
import Masonry from '@mui/lab/Masonry';

import Typography from '@components/typography';
import useList from '@features/persons/list/useList';
import { useState, MouseEvent, FC } from 'react';
import IconGroupOverseer from '@icons/IconGroupOverseer';
import { DashboardMenu } from '@features/index';
import DashboardCard from '@features/dashboard/card';
import { styled } from '@mui/system';
import CreateNewGroupModalWindow from './modal_windows/create_new_group';
import ReorderGroupsModalWindow from './modal_windows/reorder_groups';
import { EditGroupModalWindowData } from './modal_windows/edit_group/edit_group.types';
import EditGroupModalWindow from './modal_windows/edit_group';
import QuickSettingsModalWindow from './modal_windows/quick_settings';
import DeleteGroupModalWindow from './modal_windows/delete_group';
import CustomTypography from '@components/typography';
import { GroupCardContainer, GroupCardContentItem, GroupCardDivider, GroupCardHeader } from './components/group_card';

export const StyledMasonry = styled(Masonry)(({ theme }) => ({
  [theme.breakpoints.down('tablet500')]: {
    '&>*': {
      width: '100%',
    },
  },
  [theme.breakpoints.up('tablet500')]: {
    '&>*': {
      width: 'calc(50% - 8px)',
      minWidth: 'unset',
    },
  },
  [theme.breakpoints.up('desktop')]: {
    '&>*': {
      width: 'calc(25% - 12px)',
      minWidth: 'unset',
    },
  },
}));

const ServiceGroups = () => {
  const { t } = useAppTranslation();
  const { persons } = useList();

  const [createNewGroupModalWindowOpen, setCreateNewGroupModalWindowOpen] = useState(false);
  const [reorderGroupsModalWindowOpen, setReorderGroupsModalWindowOpen] = useState(false);
  const [editGroupsModalWindowOpen, setEditGroupsModalWindowOpen] = useState(false);
  const [quickSettingsModalWindowOpen, setQuickSettingsModalWindowOpen] = useState(false);
  const [deleteGroupModalWindowOpen, setDeleteGroupModalWindowOpen] = useState(false);

  const [editGroupModalWindowData, setEditGroupsModalWindowData] = useState<EditGroupModalWindowData>({
    groupName: 'Isem',
    groupNumber: '1',
    publishers: ['Ali Partyan', 'Kseniya Shutovska', 'Andrey Tregulov', 'Aleksandr Portnoy'],
  });

  return (
    <>
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <PageTitle
          title={t('tr_fieldServiceGroups')}
          buttons={
            <Stack direction={'row'} spacing={'8px'}>
              <Button
                variant="secondary"
                startIcon={<IconReorder />}
                onClick={() => {
                  setReorderGroupsModalWindowOpen(true);
                }}
              >
                {t('tr_reorderGroups')}
              </Button>
              <Button
                variant="main"
                startIcon={<IconAdd />}
                onClick={() => {
                  setCreateNewGroupModalWindowOpen(true);
                }}
              >
                {t('tr_createGroup')}
              </Button>
            </Stack>
          }
        />

        <StyledMasonry spacing={2} sequential>
          <GroupCardContainer color={'var(--group-1)'}>
            <GroupCardHeader groupNumber={1} groupName={'Issum'} visitorsCount={10} isMyGroup />

            {persons.slice(0, 9).map((value, index) => {
              const randomKey = crypto.randomUUID();

              if (index == 0) {
                return (
                  <>
                    <GroupCardContentItem
                      key={randomKey}
                      groupNumber={1}
                      primaryText={value.person_data.person_firstname.value}
                      descriptionText={t('tr_groupOverseer')}
                      icon={<IconAssistant />}
                      isBaptized
                    />
                    <GroupCardDivider groupNumber={1} />
                  </>
                );
              }

              if (index == 1) {
                return (
                  <>
                    <GroupCardContentItem
                      key={randomKey}
                      groupNumber={1}
                      primaryText={value.person_data.person_firstname.value}
                      descriptionText={t('tr_groupOverseerAssistant')}
                      thirdText="Away: June 16, 2024 - July 2, 2024"
                      icon={<IconGroupOverseer />}
                      isBaptized
                    />
                    <GroupCardDivider groupNumber={1} />
                  </>
                );
              }

              return (
                <>
                  <GroupCardContentItem
                    key={randomKey}
                    groupNumber={1}
                    primaryText={value.person_data.person_firstname.value}
                    icon={<IconPerson />}
                    isBaptized
                  />
                  {index != 8 && <GroupCardDivider groupNumber={1} />}
                </>
              );
            })}
          </GroupCardContainer>
          <GroupCardContainer color={'var(--group-2)'}>
            <GroupCardHeader groupNumber={2} groupName={''} visitorsCount={10} />

            {persons.slice(0, 9).map((value, index) => {
              const randomKey = crypto.randomUUID();

              if (index == 0) {
                return (
                  <>
                    <GroupCardContentItem
                      key={randomKey}
                      groupNumber={2}
                      primaryText={value.person_data.person_firstname.value}
                      descriptionText={t('tr_groupOverseer')}
                      icon={<IconAssistant />}
                      isBaptized
                    />
                    <GroupCardDivider groupNumber={2} />
                  </>
                );
              }

              if (index == 1) {
                return (
                  <>
                    <GroupCardContentItem
                      key={randomKey}
                      groupNumber={2}
                      primaryText={value.person_data.person_firstname.value}
                      descriptionText={t('tr_groupOverseerAssistant')}
                      thirdText="Away: June 16, 2024 - July 2, 2024"
                      icon={<IconGroupOverseer />}
                      isBaptized
                    />
                    <GroupCardDivider groupNumber={2} />
                  </>
                );
              }

              return (
                <>
                  <GroupCardContentItem
                    key={randomKey}
                    groupNumber={2}
                    primaryText={value.person_data.person_firstname.value}
                    icon={<IconPerson />}
                    isBaptized
                  />
                  {index != 8 && <GroupCardDivider groupNumber={2} />}
                </>
              );
            })}
          </GroupCardContainer>

          <GroupCardContainer color={'var(--group-3)'}>
            <GroupCardHeader groupNumber={3} groupName={'Gelsenkirchen'} visitorsCount={10} />

            {persons.slice(0, 9).map((value, index) => {
              const randomKey = crypto.randomUUID();

              if (index == 0) {
                return (
                  <>
                    <GroupCardContentItem
                      key={randomKey}
                      groupNumber={3}
                      primaryText={value.person_data.person_firstname.value}
                      descriptionText={t('tr_groupOverseer')}
                      icon={<IconAssistant />}
                      isBaptized
                    />
                    <GroupCardDivider groupNumber={3} />
                  </>
                );
              }

              if (index == 1) {
                return (
                  <>
                    <GroupCardContentItem
                      key={randomKey}
                      groupNumber={3}
                      primaryText={value.person_data.person_firstname.value}
                      descriptionText={t('tr_groupOverseerAssistant')}
                      thirdText="Away: June 16, 2024 - July 2, 2024"
                      icon={<IconGroupOverseer />}
                      isBaptized
                    />
                    <GroupCardDivider groupNumber={3} />
                  </>
                );
              }

              return (
                <>
                  <GroupCardContentItem
                    key={randomKey}
                    groupNumber={3}
                    primaryText={value.person_data.person_firstname.value}
                    icon={<IconPerson />}
                    isBaptized
                  />
                  {index != 8 && <GroupCardDivider groupNumber={3} />}
                </>
              );
            })}
          </GroupCardContainer>
        </StyledMasonry>
      </Box>
      <DarkOverlay overlayIsOpened={createNewGroupModalWindowOpen}>{/* <CreateNewGroupModalWindow /> */}</DarkOverlay>
      <DarkOverlay overlayIsOpened={reorderGroupsModalWindowOpen}>
        {/* <ReorderGroupsModalWindow
          groups={[
            { groupNum: '1', groupName: 'Group name' },
            { groupNum: '2', groupName: 'Issum' },
          ]}
          onChange={() => {
            null;
          }}
        /> */}
      </DarkOverlay>
      <DarkOverlay overlayIsOpened={editGroupsModalWindowOpen}>
        {/* <EditGroupModalWindow
          data={editGroupModalWindowData}
          onDeleteButtonClick={() => {
            setEditGroupsModalWindowOpen(false);
            setDeleteGroupModalWindowOpen(true);
          }}
          onSaveButtonClick={() => {
            null;
          }}
        /> */}
      </DarkOverlay>
      <DarkOverlay overlayIsOpened={quickSettingsModalWindowOpen}>
        {/* <QuickSettingsModalWindow showTimeAwayToAllUsers={true} /> */}
      </DarkOverlay>
      <DarkOverlay overlayIsOpened={deleteGroupModalWindowOpen}>
        {/* <DeleteGroupModalWindow groupId={parseInt(editGroupModalWindowData.groupNumber)} /> */}
      </DarkOverlay>
    </>
  );
};

export default ServiceGroups;
