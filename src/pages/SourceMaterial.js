import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import ImportEPUB from '../components/sourceMaterial/ImportEPUB';
import ImportJWOrg from '../components/sourceMaterial/ImportJWOrg';
import WeekDetails from '../components/sourceMaterial/WeekDetails';
import {
	isImportEPUBState,
	isImportJWOrgState,
} from '../appStates/appSourceMaterial';

const SourceMaterial = () => {
	const isImportEPUB = useRecoilValue(isImportEPUBState);
	const isImportJw = useRecoilValue(isImportJWOrgState);

	return (
		<>
			{isImportEPUB && <ImportEPUB />}
			{isImportJw && <ImportJWOrg />}
			<Box
				sx={{
					marginRight: '5px',
					marginTop: '10px',
				}}
			>
				<WeekDetails />
			</Box>
		</>
	);
};

export default SourceMaterial;
