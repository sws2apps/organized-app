import { format } from 'date-fns';
import { dbSavePersonExp } from './dbPersons';

export const importDummyStudents = async () => {
	const res = await fetch('https://dummyjson.com/users?limit=100');
	const data = await res.json();

	for (let i = 0; i < data.users.length; i++) {
		const user = data.users[i];

		let obj = {};

		obj.person_name = `${user.lastName} ${user.firstName}`;
		obj.person_displayName = `${user.lastName.substring(0, 1)}. ${
			user.firstName
		}`;
		obj.isMale = user.gender === 'male';
		obj.isFemale = user.gender === 'female';

		if (user.gender === 'male') {
			obj.assignments = [
				{
					assignmentId: window.crypto.randomUUID(),
					code: 100,
					startDate: format(new Date(), 'MM/dd/yyyy'),
					endDate: null,
					comments: '',
				},
				{
					assignmentId: window.crypto.randomUUID(),
					code: 104,
					startDate: format(new Date(), 'MM/dd/yyyy'),
					endDate: null,
					comments: '',
				},
			];
		}
		if (user.gender === 'female') {
			obj.assignments = [
				{
					assignmentId: window.crypto.randomUUID(),
					code: 101,
					startDate: format(new Date(), 'MM/dd/yyyy'),
					endDate: null,
					comments: '',
				},
				{
					assignmentId: window.crypto.randomUUID(),
					code: 102,
					startDate: format(new Date(), 'MM/dd/yyyy'),
					endDate: null,
					comments: '',
				},
				{
					assignmentId: window.crypto.randomUUID(),
					code: 103,
					startDate: format(new Date(), 'MM/dd/yyyy'),
					endDate: null,
					comments: '',
				},
			];
		}

		await dbSavePersonExp(obj);
	}
};
