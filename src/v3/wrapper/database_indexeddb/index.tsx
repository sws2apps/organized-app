/*
This file will be the entry to get the live update from IndexedDb using dexie hooks
*/

import { ReactNode, useEffect } from 'react';
import useIndexedDb from './useIndexedDb';

const DatabaseWrapper = ({ children }: { children?: ReactNode }) => {
	const { loadSettings, loadAssignment, loadPersons, loadSchedules, loadSources, loadWeekType } = useIndexedDb();

	useEffect(() => {
		loadSettings();
	}, [loadSettings]);

	useEffect(() => {
		loadAssignment();
	}, [loadAssignment]);

	useEffect(() => {
		loadPersons();
	}, [loadPersons]);

	useEffect(() => {
		loadSchedules();
	}, [loadSchedules]);

	useEffect(() => {
		loadWeekType();
	}, [loadWeekType]);

	useEffect(() => {
		loadSources();
	}, [loadSources]);

	return <>{children}</>;
};

export default DatabaseWrapper;
