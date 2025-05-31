import Select from '@components/select';
import MenuItem from '@components/menuitem';
import { Box, SelectChangeEvent, Typography } from '@mui/material';
import { MemberSelectorType } from './index.type';
import Button from '@components/button';
import { useBreakpoints, useAppTranslation } from '@hooks/index';
import { IconAdd, IconDelete } from '@components/icons';
import { buildPersonFullname } from '../../../../utils/common';

const MemberSelector = ({ label, options, selected, isLast = false, onAddMember, onSelectPerson, onRemovePerson }: MemberSelectorType) => {
	const { tablet600Down } = useBreakpoints();
	const { t } = useAppTranslation();
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
			<Select
				defaultValue={selected}
				sx={{ width: '100%', flex: 1 }}
				label={label}
				onChange={(e: SelectChangeEvent<string>) => {
					onSelectPerson(e.target.value)
					if (typeof onAddMember === 'function') {
						onAddMember()
					}
				}}
			>
				{options.map((option) => (
					<MenuItem key={option.person_uid} value={option.person_uid}>
						<Typography>{buildPersonFullname(option.person_data.person_lastname.value, option.person_data.person_firstname.value)}</Typography>
					</MenuItem>
				))}

			</Select>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					justifyContent: 'space-between',
					flexDirection: tablet600Down ? 'row' : 'row-reverse',
				}}
			>
				<Button
					variant="small"
					color="red"
					startIcon={<IconDelete />}
					sx={{
						height: '32px',
						minHeight: '32px !important',
						width: tablet600Down ? 'fit-content' : 'auto',
					}}
					onClick={() => onRemovePerson(selected)}
				>
					{t('tr_delete')}
				</Button>
				{isLast && <Button
					variant="small"
					startIcon={<IconAdd />}
					sx={{
						height: '32px',
						minHeight: '32px !important',
						width: tablet600Down ? 'fit-content' : 'auto',
					}}
					onClick={() => {
						if (typeof onAddMember === 'function') {
							onAddMember()
						}
					}}
				>
					{t('tr_add')}
				</Button>}
			</Box>
		</Box>

	)
}

export default MemberSelector;