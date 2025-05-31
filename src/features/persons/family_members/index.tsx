import { Box, Divider, Typography } from '@mui/material';

import { useAtomValue } from 'jotai/react';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import MemberSelector from './member_selector';
import { useCallback, useMemo, useState } from 'react';
import { setPersonCurrentDetails } from '@services/states/persons';

const FamilyMembers = () => {
	const personsActive = useAtomValue(personsActiveState);
	const currentPerson = useAtomValue(personCurrentDetailsState);
	const [newlyAddedMemberCount, setNewlyAddedMemberCount] = useState(1);
	const familyMembers = useMemo(() => {
		if (currentPerson.person_data.family_members) {
			return currentPerson.person_data.family_members.members;
		}
		return [];
	}, [currentPerson]);

	const selectOptions = useMemo(
		() =>
			personsActive.filter(
				(person) =>
					!familyMembers.includes(person.person_uid) &&
					person.person_uid !== currentPerson.person_uid
			),
		[currentPerson.person_uid, familyMembers, personsActive]
	);

	const handleAddNewMember = useCallback(() => {
		setNewlyAddedMemberCount((prev) => prev + 1);
	}, []);

	const onSelectPerson = useCallback(
		(personId: string) => {
			const person = structuredClone(currentPerson);
			if (person.person_data.family_members.members.includes(personId)) {
				return;
			}
			person.person_data.family_members.members.push(personId);
			person.person_data.family_members.updatedAt = new Date().toISOString();
			setPersonCurrentDetails(person);
			setNewlyAddedMemberCount((prev) => Math.max(prev - 1, 0));
		},
		[currentPerson]
	);

	console.log(familyMembers);

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
						(person) => person.person_uid === member || !familyMembers.includes(person.person_uid)
					)}
					onSelectPerson={onSelectPerson}
				/>
			))}
			{Array.from({ length: newlyAddedMemberCount }).map((_, idx) => (
				<MemberSelector
					key={idx}
					label="Family member"
					options={selectOptions}
					isLast={newlyAddedMemberCount === idx + 1}
					onAddMember={handleAddNewMember}
					onSelectPerson={onSelectPerson}
				/>
			))}
		</Box>
	);
};

export default FamilyMembers;
