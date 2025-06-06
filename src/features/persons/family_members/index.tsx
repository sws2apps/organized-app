import { Box, Typography } from '@mui/material';

import Button from '@components/button';

import MemberSelector from './member_selector';
import useFamilyMembers from './useFamilyMembers';
import { useBreakpoints, useAppTranslation } from '@hooks/index';
import { IconAdd } from '@components/icons';

const FamilyMembers = () => {
	const { tablet600Down } = useBreakpoints();
	const { t } = useAppTranslation();
	const {
		haveFamily,
		addFamily,
		isMemberOfFamily,
		handleAddFamily,
	} = useFamilyMembers();

	const showMemberSelector = haveFamily || addFamily || isMemberOfFamily

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
			<Typography className='h6'>List everyone who belongs to this family – including this person</Typography>
			{showMemberSelector ? (
				<MemberSelector />
			) : (
				<Box sx={{ width: '100%', display: 'flex', justifyContent: 'start' }}>
					<Button
						variant="small"
						startIcon={<IconAdd />}
						sx={{
							height: '32px',
							minHeight: '32px !important',
							width: tablet600Down ? 'fit-content' : 'auto',
						}}
						onClick={handleAddFamily}
					>
						{t('tr_add')}
					</Button>
				</Box>
			)}

		</Box>
	);
};

export default FamilyMembers;
