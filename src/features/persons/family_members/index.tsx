import { Box, Typography } from '@mui/material';

import MemberSelector from './member_selector';
import useFamilyMembers from './useFamilyMembers';
import { Switch, } from '@components/index';
import { IconInfo } from '@components/icons';
import { buildPersonFullname } from '@utils/common';

const FamilyMembers = () => {
	const {
		isMemberOfFamily,
		currentFamily,
		onSetHead,
		isFamilyHead
	} = useFamilyMembers();

	return (
		<Box
			sx={{
				backgroundColor: 'var(--white)',
				border: '1px solid var(--accent-300)',
				display: 'flex',
				padding: '16px',
				flexDirection: 'column',
				borderRadius: 'var(--radius-xl)',
				flex: 1,
				width: '100%',
				gap: '16px',
			}}
		>
			<Typography className="h2">Family members</Typography>
			{isMemberOfFamily ? (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<IconInfo color="var(--grey-350)" />
					<Typography color="var(--grey-350)">
						This person is a member of the {buildPersonFullname(currentFamily.person_data.person_lastname.value, currentFamily.person_data.person_firstname.value)} family. To edit  the family members list, go to the family head&apos;s profile.
					</Typography>
				</Box>
			) : (
				<>
					<Typography className='h6'>Set this person as the family head to add all family members</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
						<Switch
							checked={isFamilyHead}
							onChange={onSetHead}
						/>
						<Typography className="h3">Family head</Typography>
					</Box>
					{isFamilyHead && <MemberSelector />}
				</>

			)}
		</Box>
	);
};

export default FamilyMembers;
