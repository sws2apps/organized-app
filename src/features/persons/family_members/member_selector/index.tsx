import Select from '@components/select';
import MenuItem from '@components/menuitem';
import { Box, SelectChangeEvent, Typography } from '@mui/material';
import { UsersOption } from './index.type';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import MiniChip from '@components/mini_chip';
import useFamilyMembers from '../useFamilyMembers';

const MemberSelector = () => {
	const { onRemovePerson, onSelectHead, handleAddFamilyMembers, familyMembers, options } = useFamilyMembers()

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
			<Select
				value={familyMembers.head}
				defaultValue={familyMembers.head}
				sx={{ width: '100%', flex: 1 }}
				label="Family head"
				onChange={(e: SelectChangeEvent<string>) => {
					onSelectHead(e.target.value)
				}}
			>
				{options.headOptions.map((option) => (
					<MenuItem key={option.person_uid} value={option.person_uid}>
						<Typography>{option.person_name}</Typography>
					</MenuItem>
				))}

			</Select>
			<AutocompleteMultiple
				label="Family members"
				fullWidth={true}
				options={options.memberOptions}
				getOptionLabel={(option: UsersOption) => option.person_name}
				isOptionEqualToValue={(option, value) =>
					option.person_uid === value.person_uid
				}
				value={options.memberOptions.filter((r) => familyMembers.members.includes(r.person_uid))}
				onChange={(_, value: UsersOption[]) =>
					handleAddFamilyMembers(value.map(v => v.person_uid))
				}
				renderOption={(props, option) => (
					<Box
						component="li"
						{...props}
						sx={{ margin: 0, padding: 0 }}
						key={option.person_uid}
					>
						<Typography>{option.person_name}</Typography>
					</Box>
				)}
				height={40}
				renderValue={(value: UsersOption[]) =>
					value.map((option: UsersOption) => {
						return (
							<MiniChip
								key={option.person_uid}
								label={option.person_name}
								edit={true}
								onDelete={() => onRemovePerson(option.person_uid)}
							/>
						);
					})
				}
			/>
		</Box>

	)
}

export default MemberSelector;