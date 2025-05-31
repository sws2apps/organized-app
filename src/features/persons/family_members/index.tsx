import { Box, Divider, Typography } from '@mui/material';

import MemberSelector from './member_selector';
import useFamilyMembers from './useFamilyMembers';

const FamilyMembers = () => {
	const {
		handleAddNewMember,
		newlyAddedMemberCount,
		onSelectPerson,
		options,
		personsActive,
		familyMembers,
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
			{/* <MemberSelector label="Family head" options={personsActive} /> */}

			<Divider sx={{ borderColor: 'var(--accent-200)' }} />
			{familyMembers?.map((member) => (
				<MemberSelector
					key={member}
					label="Family member"
					selected={member}
					options={personsActive.filter(
						(person) =>
							person.person_uid === member ||
							!familyMembers.includes(person.person_uid)
					)}
					onSelectPerson={onSelectPerson}
				/>
			))}
			{Array.from({ length: newlyAddedMemberCount }).map((_, idx) => (
				<MemberSelector
					key={idx}
					label="Family member"
					options={options}
					isLast={newlyAddedMemberCount === idx + 1}
					onAddMember={handleAddNewMember}
					onSelectPerson={onSelectPerson}
				/>
			))}
		</Box>
	);
};

export default FamilyMembers;
