import { Box, Typography } from '@mui/material';

import MemberSelector from './member_selector';
import useFamilyMembers from './useFamilyMembers';
import Switch from '@components/switch';
import { IconInfo } from '@components/icons';
import { buildPersonFullname } from '@utils/common';
import {
	useAppTranslation,
} from '@hooks/index';

const FamilyMembers = () => {
	const { t } = useAppTranslation();
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
			<Typography className="h2">{t('tr_family')}</Typography>
			{isMemberOfFamily ? (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<IconInfo color="var(--grey-350)" />
					<Typography color="var(--grey-350)">
						{t('tr_personAlreadyMemberOfFamily', { familyHead: buildPersonFullname(currentFamily.person_data.person_lastname.value, currentFamily.person_data.person_firstname.value) })}
					</Typography>
				</Box>
			) : (
				<>
					<Typography className='h6'>{t('tr_setPersonToFamilyHead')}</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
						<Switch
							checked={isFamilyHead}
							onChange={onSetHead}
						/>
						<Typography className="h3">{t('tr_familyHead')}</Typography>
					</Box>
					{isFamilyHead && <MemberSelector />}
				</>

			)}
		</Box>
	);
};

export default FamilyMembers;
