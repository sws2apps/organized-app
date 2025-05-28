import Select from '@components/select';
import MenuItem from '@components/menuitem';
import { Box, SelectChangeEvent, Typography } from '@mui/material';
import { MemberSelectorType } from './index.type';
import Button from '@components/button';
import { useBreakpoints, useAppTranslation } from '@hooks/index';
import { IconAdd, IconDelete } from '@components/icons';

const MemberSelector = ({ label, options }: MemberSelectorType) => {
	const { tablet600Down } = useBreakpoints();
	const { t } = useAppTranslation();
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
			<Select
				slotProps={{ root: { className: 'service-group-selector' } }}
				sx={{ width: '100%', flex: 1 }}
				label={label}
				onChange={(e: SelectChangeEvent<string>) => {
					console.log(e.target.value)
				}}
			>
				{options.map((option) => (
					<MenuItem key={option.person_uid} value={option.person_uid}>
						<Typography>{option.person_data.person_firstname.value + ' ' + option.person_data.person_lastname.value}</Typography>
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
				>
					{t('tr_delete')}
				</Button>
				<Button
					variant="small"
					startIcon={<IconAdd />}
					sx={{
						height: '32px',
						minHeight: '32px !important',
						width: tablet600Down ? 'fit-content' : 'auto',
					}}
				>
					{t('tr_add')}
				</Button>
			</Box>
		</Box>

	)
}

export default MemberSelector;