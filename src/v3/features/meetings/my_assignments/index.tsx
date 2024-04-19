import { useRecoilValue } from 'recoil';
import { Box, MenuItem, Stack } from '@mui/material';
import { IconInfo, IconManageAccounts, IconSync } from '@icons/index';
import ButtonIcon from '@components/icon_button';
import Select from '@components/select';
import Typography from '@components/typography';
import AssigmentItem, { AssigmentMonthItem } from '@components/assigments';
import Badge from '@components/badge';
import Drawer from '@components/drawer';
import { isMyAssignmentOpenState } from '@states/app';
import { setIsMyAssignmentOpen } from '@services/recoil/app';
import { ReactNode, useEffect, useState } from 'react';
import InfoTip from '@components/info_tip';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import { personsFilteredState } from '@states/persons';
import useAssignments from '@features/meetings/my_assignments/useAssignments';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const MyAssignments = () => {
  const { t } = useAppTranslation();
  const persons = useRecoilValue(personsFilteredState);
  const open = useRecoilValue(isMyAssignmentOpenState);
  const { handleManualRefresh } = useAssignments();

  const [value, setValue] = useState(0);
  const [personAssignments, setPersonAssignments] = useState('');

  useEffect(() => {
    if (!open) setValue(0);
  }, [open]);

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  const handleClose = async () => {
    await setIsMyAssignmentOpen(false);
  };

  return (
    <Drawer
      anchor={'left'}
      open={open}
      onClose={handleClose}
      title={t('tr_viewMyAssignments')}
      headActions={
        <Stack direction={'row'} spacing={0.5}>
          <ButtonIcon onClick={() => handleChange(1)}>
            <IconManageAccounts color="var(--black)" />
          </ButtonIcon>
          <ButtonIcon onClick={handleManualRefresh}>
            <IconSync color="var(--black)" />
          </ButtonIcon>
        </Stack>
      }
    >
      <CustomTabPanel value={value} index={0}>
        <Stack spacing={2.3}>
          <Select label={t('tr_display')} value="">
            {['Next 6 months', 'Next 12 months'].map((time) => (
              <MenuItem key={time} value={time}>
                <Typography className="body-regular" color="var(--black)">
                  {time}
                </Typography>
              </MenuItem>
            ))}
          </Select>

          <Stack spacing={1}>
            <AssigmentMonthItem assigmentDate={'2024-04-01'} />
            <AssigmentItem assigmentDate={'2024-04-01'}>
              <Stack justifyContent={'center'}>
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <Typography className={'h3'}>Bible study</Typography>
                  <Badge text="Hall A" color="accent" size="medium" centerContent />
                </Stack>
                <Typography className={'body-small-semibold'} color={'var(--grey-400)'}>
                  Assistant: S. Kovelekena
                </Typography>
                <Typography className={'body-small-regular'} color={'var(--grey-350)'}>
                  (5 min.) lff lesson 12 summary, review, and goal (th study 19)
                </Typography>
              </Stack>
            </AssigmentItem>
          </Stack>

          <Stack spacing={1}>
            <AssigmentMonthItem assigmentDate={'2024-03-09'} />
            <AssigmentItem assigmentDate={'2024-03-09'}>
              <Stack justifyContent={'center'}>
                <Typography className={'h3'}>Watchtower study reader</Typography>
                <Typography className={'body-small-semibold'} color={'var(--grey-400)'}>
                  “Continue to Be Patient”
                </Typography>
              </Stack>
            </AssigmentItem>

            <AssigmentItem assigmentDate={'2024-03-18'}>
              <Typography className={'h3'}>Spiritual gems</Typography>
            </AssigmentItem>

            <AssigmentItem assigmentDate={'2024-03-20'}>
              <Stack justifyContent={'center'}>
                <Typography className={'h3'}>Public talk</Typography>
                <Typography className={'body-small-semibold'} color={'var(--grey-400)'}>
                  “Will You Be a Survivor of the Last Days?”
                </Typography>
              </Stack>
            </AssigmentItem>
          </Stack>
        </Stack>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Stack spacing={2.3}>
          <InfoTip
            isBig={false}
            icon={<IconInfo />}
            color="blue"
            text="To see your name in the list, make sure your person record exists on the All persons page."
          />
          <Select label={t('tr_yourPersonRecord')} value={personAssignments}>
            {persons.map((person) => (
              <MenuItem
                onClick={() => setPersonAssignments(`${person.person_firstname.value} ${person.person_lastname.value}`)}
                key={person.person_uid}
                value={`${person.person_firstname.value} ${person.person_lastname.value}`}
              >
                <Typography className="body-regular" color="var(--black)">
                  {`${person.person_firstname.value} ${person.person_lastname.value}`}
                </Typography>
              </MenuItem>
            ))}
          </Select>
          <Button variant={'main'} onClick={() => setValue(0)}>
            {t('tr_save')}
          </Button>
        </Stack>
      </CustomTabPanel>
    </Drawer>
  );
};

export default MyAssignments;
