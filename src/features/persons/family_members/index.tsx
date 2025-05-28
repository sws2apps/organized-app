import { Box, Divider, Typography } from "@mui/material"

import { useAtomValue } from "jotai/react";
import { personsActiveState } from '@states/persons'
import MemberSelector from "./member_selector";

const FamilyMembers = () => {
	const personsActive = useAtomValue(personsActiveState);

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
				gap: '16px'
			}}
		>

			<Typography className="h2">Family members</Typography>
			<MemberSelector label="Family head" options={personsActive} />

			<Divider sx={{ borderColor: 'var(--accent-200)' }} />

			<MemberSelector label="Family member" options={personsActive} />
		</Box>
	)
}

export default FamilyMembers;