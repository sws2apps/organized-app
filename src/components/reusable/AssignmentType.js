import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { assTypeLocalNewState } from '../../appStates/appSourceMaterial';

const AssignmentType = ({
	student,
	assignable,
	currentType,
	handleChangeType,
}) => {
	const { t } = useTranslation();

	const assTypeList = useRecoilValue(assTypeLocalNewState);
	const [localList, setLocalList] = useState([]);
	const [isFemale, setIsFemale] = useState(false);

	useEffect(() => {
		setIsFemale(student.isFemale);
	}, [student.isFemale]);

	useEffect(() => {
		if (assignable) {
			let data = assTypeList.filter((assType) => assType.assignable === true);

			if (isFemale) {
				data = data.filter((assType) => assType.maleOnly !== true);
			}

			setLocalList(data);
		} else {
			setLocalList(assTypeList);
		}
	}, [assTypeList, assignable, isFemale]);

	const renderPartType = (type) => {
		return (
			<MenuItem key={type.value} value={type.value}>
				{type.label}
			</MenuItem>
		);
	};

	return (
		<>
			{localList.length > 0 && (
				<TextField
					id='outlined-select-type'
					select
					label={t('sourceMaterial.partType')}
					size='small'
					value={currentType}
					onChange={(e) => handleChangeType(e.target.value)}
					sx={{
						minWidth: '250px',
					}}
				>
					{localList.map((partType) => renderPartType(partType))}
				</TextField>
			)}
		</>
	);
};

export default AssignmentType;
