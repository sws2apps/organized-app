import { useRecoilValue } from 'recoil';
import { MenuItem, Stack } from '@mui/material';
import { IconManageAccounts, IconSync } from '@icons/index';
import ButtonIcon from '@components/icon_button';
import Select from '@components/select';
import Typography from '@components/typography';
import AssigmentItem, { AssigmentMonthItem } from '@components/assigments';
import Badge from '@components/badge';
import Drawer from '@components/drawer';
import { isMyAssignmentOpenState } from '@states/app';
import { setIsMyAssignmentOpen } from '@services/recoil/app';

const MyAssignments = () => {
  const open = useRecoilValue(isMyAssignmentOpenState);

  const handleClose = async () => {
    await setIsMyAssignmentOpen(false);
  };

  return (
    <Drawer
      anchor={'left'}
      open={open}
      onClose={handleClose}
      title={'My assignments'}
      headActions={
        <Stack direction={'row'} spacing={0.5}>
          <ButtonIcon>
            <IconManageAccounts color="var(--black)" />
          </ButtonIcon>
          <ButtonIcon>
            <IconSync color="var(--black)" />
          </ButtonIcon>
        </Stack>
      }
    >
      <Stack spacing={2.3}>
        <Select label={'Display'} value="">
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
    </Drawer>
  );
};

export default MyAssignments;
